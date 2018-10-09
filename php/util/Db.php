<?php

namespace LastFmTube\Util;

use Exception;
use PDO;

/**
 * Class Db
 * @package LastFmTube\Util
 */
class Db {

    /**
     * @var Db
     */
    private static $instance;

    /**
     * @var PDO
     */
    private $pdo = false;

    /**
     * @var array|\PDOStatement
     */
    private $statements = false;


    private $replaceTitleMap = null;

    /**
     * Db constructor.
     * @param bool $file
     * @throws Exception
     */
    private function __construct($file = false) {
        $this->connect();
        $this->prepareQueries();
        $this->loadReplacements();
    }

    public function connect() {
        if ($this->isConnected()) return;

        $settings = Functions::getInstance()->getSettings();
        $this->pdo = new PDO ($settings ['database'] ['dsn'], $settings ['database'] ['username'],
                              $settings ['database'] ['password']
        );

        $this->createdb();
    }

    public function isConnected() {
        return $this->pdo !== false;
    }

    /**
     * @return bool
     */
    public function createdb() {
        if ($this->validate()) return false;
        $this->connect();
        $sqlf = file_get_contents($this->settings ['database']['dbinit_file']);
        if ($sqlf === false) {
            Functions::getInstance()->logMessage('Error could not open initdb sql file');
            return $sqlf;
        }

        $this->pdo->exec($sqlf);
        return true;
    }

    private function validate() {
        $this->connect();
        $valid = $this->tableExists('trackplay') &&
                 $this->tableExists('lfmuserplay') &&
                 $this->tableExists('fimport') &&
                 $this->tableExists('replacement');

        return $valid;
    }

    /**
     * Check if a table exists in the current database.
     *
     * @param string $table
     *            Table to search for.
     * @return bool TRUE if table exists, FALSE if no table found.
     */
    private function tableExists($table) {

        // Try a select statement against the table
        // Run it in try/catch in case PDO is in ERRMODE_EXCEPTION.
        try {
            $result = $this->pdo->query("SELECT 1 FROM $table LIMIT 1");
        } catch (Exception $e) {
            // We got an exception == table not found
            return false;
        }

        // Result is either boolean FALSE (no table found) or PDOStatement Object (table found)
        return $result !== false;
    }

    private function prepareQueries() {
        if ($this->statements !== false) return;
        $this->statements = array(

            'SELECT_ALL_LASTFM_USER' => '
				SELECT lfmuser, lastplayed, playcount						
				FROM lfmuserplay
				ORDER BY 
					playcount DESC,
					lastplayed DESC
				LIMIT :limit OFFSET :offset;
			',

            'SELECT_ALL_LASTFM_USER_NUM_ROWS' => '
				SELECT COUNT(*)	AS cnt					
				FROM lfmuserplay;
			',

            'SELECT_LASTFM_USER_VISIT' => '
                WITH chart_user AS (
                    SELECT * FROM lfmuserplay
                    WHERE lfmuser = :user
                ), chart_count AS (
                    SELECT * 
                    FROM lfmuserplay mc, chart_user cu
                        WHERE mc.playcount < cu.playcount OR (
                        mc.playcount = cu.playcount AND 
                        mc.lastplayed < cu.lastplayed
                    )
                )
                SELECT ((SELECT COUNT(*) 
                        FROM lfmuserplay) - COUNT(*)
                    ) AS pos, cu.*
                FROM chart_count ck, chart_user cu
			',

            'UPDATE_LASTFM_USER_VISIT' => '
				UPDATE lfmuserplay 
				SET
				  playcount = playcount + 1,
				  lastplayed = :lastplayed
				WHERE lfmuser = :lfmuser;
			',

            'INSERT_LASTFM_USER_VISIT' => '
				INSERT INTO lfmuserplay 
				(lfmuser, lastplayed, playcount) 
				VALUES(:lfmuser, :lastplayed, 1);
			',

            'UPDATE_TRACKPLAY' => '
			    UPDATE trackplay
			    SET
				  playcount = playcount + 1,
				  lastplayed = :lastplayed,
				  lastplay_ip = :lastplay_ip
			    WHERE
				  artist = :artist 
				  AND title = :title;
			',

            'INSERT_TRACKPLAY' => '
			    INSERT INTO trackplay
			    (artist, title, playcount, lastplayed, lastplay_ip)
			    VALUES(:artist, :title, 1, :lastplayed, :lastplay_ip)
			',

            'SELECT_TRACKPLAY'          => '
				SELECT artist, title, playcount, lastplayed, lastplay_ip, url
				FROM v_trackplay
			    WHERE playcount > 0
			    ORDER BY playcount DESC, lastplayed DESC 
			    LIMIT :limit OFFSET :offset;
			',
            'SELECT_TRACKPLAY_NUM_ROWS' => '
                SELECT COUNT(*) AS cnt FROM v_trackplay;
            ',

            'SELECT_TRACKPLAY_BY_TRACK' =>
            /** @lang PostgreSQL */
                '
                WITH cte AS (
                     SELECT 
                     RANK() OVER (ORDER BY playcount DESC) AS pos,
                     artist, title, orig_artist, orig_title, playcount, lastplayed, lastplay_ip, url
                     FROM v_trackplay 
                 ) 
                 SELECT pos, artist, title, playcount, lastplayed, lastplay_ip, url 
                 FROM cte
                 WHERE artist =:artist AND title = :title 
                 OR orig_artist = :artist AND orig_title = :title;
            ',

            'GET_VIDEO' => '
				SELECT url FROM trackplay 
				WHERE artist = :artist AND title = :title
			',

            'EDIT_VIDEO' => '
				UPDATE trackplay 
				SET url = :url
				WHERE artist = :artist AND title = :title
			',

            'DELETE_VIDEO' => '
                UPDATE trackplay
                SET url = NULL 
                WHERE artist = :artist AND title = :title
            ',

            'ADD_VIDEO' => '
				INSERT INTO trackplay (artist, title, url) VALUES (:artist, :title, :url);
			',

            'LOAD_TITLE_REPLACEMENTS' => '
                SELECT orig, repl 
                FROM replacement 
                WHERE repltyp = "TITLE";
            ',

            'INSERT_REPLACEMENT' => '
                REPLACE INTO replacement(repltyp, orig, repl) VALUES (:repltyp, :orig, :repl);
            ',

            'SELECT_FIMPORT_SHA' => '
                SELECT shasum FROM fimport WHERE fname = :fname
            ',

            'SET_FIMPORT_SHA' => '
                REPLACE INTO fimport VALUES(:fname, :shasum)
            '
        );

        foreach ($this->statements as $prefix => $query) {
            $this->statements [$prefix] = $this->pdo->prepare($query);
            if ($this->statements[$prefix] === false) {
                Functions::getInstance()->logMessage('error creating query: ' . $query);
                Functions::getInstance()->logMessage('>>>' . print_r($this->pdo->errorInfo(), true));
            }
        }
    }

    private function loadReplacements() {
        $funcs = Functions::getInstance();
        $csvfn = $funcs->getSettings()['database']['replacement_csv'];
        if (!file_exists($csvfn)) return;

        $csvsha    = sha1_file($csvfn);
        $saved_sha = $this->query('SELECT_FIMPORT_SHA', array('fname' => basename($csvfn)));
        $saved_sha = is_array($saved_sha) && isset($saved_sha['shasum']) ?
            $saved_sha['shasum'] : '';
        if (strcmp($csvsha, $saved_sha) === 0) {
            return; //file has not changed
        }
        Functions::getInstance()->logMessage($csvfn . ' has changed importing new data.');

        $csvf = fopen($csvfn, 'r');
        if ($csvf === false) {
            $funcs->logMessage('initial replacement csv file ' . $csvfn . ' not found');
            return;
        }

        $rcnt = 0;
        while (($row = fgetcsv($csvf, 1000)) !== false) {
            if ($rcnt === 0) {
                $rcnt++;
                continue; //ignore header row
            }
            if (sizeof($row) < 3) {
                $funcs->logMessage('skip row ' . ($rcnt + 1) . ' insufficient data');
                continue;
            }
            $typ  = $row[0];
            $orig = $row[1];
            $repl = $row[2];
            $this->query('INSERT_REPLACEMENT',
                         array('repltyp' => $typ, 'orig' => $orig, 'repl' => $repl)
            );

            $rcnt++;
        }

        $this->query('SET_FIMPORT_SHA',
                     array('fname'  => basename($csvfn),
                           'shasum' => $csvsha)
        );
        $funcs->logMessage(($rcnt - 1) . ' rows imported');

    }

    public function query($queryName, $namedParms = array()) {
        if (!isset ($this->statements [$queryName])) return false;
        $result = $this->statements [$queryName]->execute($namedParms);
        if ($result === false) {
            $error = $this->statements[$queryName]->errorInfo();
            if ($error != null && $error !== false) {
                Functions::getInstance()->logMessage('DB Error occured:');
                Functions::getInstance()->logMessage(print_r($error, true));
            }

            Functions::getInstance()->logMessage($this->statements[$queryName]->errorInfo());
            return false;
        }

        $data = $this->statements [$queryName]->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) <= 0) {
            return $this->statements[$queryName]->rowCount();
        }
        else if (sizeof($data) === 1 &&
                 Strings::endsWith($queryName, '_NUM_ROWS') ||
                 strcmp($queryName, 'SELECT_FIMPORT_SHA') === 0) {
            return $data[0];
        }
        return $data;
    }

    public static function getVersion() {
        $dbh  = new PDO('sqlite::memory:');
        $data = $dbh->query('select sqlite_version()')->fetch()[0];
        $dbh  = null;
        return $data;
    }

    /**
     * @param      $user
     * @param bool $ignoreCase
     * @return array
     * @throws Exception
     */
    public function updateLastFMUserVisit($user, $ignoreCase = true) {
        $origUser = $user;
        if ($ignoreCase) $user = strtolower($user);
        $curvisit = date('Y-m-d H:i:s');

        $upres = $this->statements ['UPDATE_LASTFM_USER_VISIT']->execute(
            array(
                'lastplayed' => $curvisit,
                'user'       => $user
            )
        );
        if ($upres !== false && $this->statements ['UPDATE_LASTFM_USER_VISIT']->rowCount() == 1) {
            return $this->readLastFMUserVisitForUpdate($origUser);
        }
        $this->statements ['INSERT_LASTFM_USER_VISIT']->execute(
            array(
                'user'       => $user,
                'lastplayed' => $curvisit
            )
        );
        return $this->readLastFMUserVisitForUpdate($origUser);

    }

    /**
     * @param $user
     * @return array
     * @throws Exception
     */
    private function readLastFMUserVisitForUpdate($user) {
        Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->execute(array('user' => $user));
        $data = Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) {
            return array(
                'playcount'  => -1,
                'lastplayed' => ''
            );
        }

        return $data[0];
    }

    /**
     * @return Db
     * @throws Exception
     */
    public static function getInstance() {
        if (is_null(self::$instance)) {
            self::$instance = new static ();
        }
        return self::$instance;
    }

    public function updateTrackPlay($artist, $title) {
        $lastvisit = date('Y-m-d H:i:s');

        $upres = $this->statements ['UPDATE_TRACKPLAY']->execute(
            array(
                'lastplayed'  => $lastvisit,
                'lastplay_ip' => $_SERVER ['REMOTE_ADDR'],
                'artist'      => $artist,
                'title'       => $title
            )
        );
        if ($upres !== false && $this->statements ['UPDATE_TRACKPLAY']->rowCount() == 1) {
            return $this->readChartForUpdate($artist, $title);
        }


        $this->statements ['INSERT_TRACKPLAY']->execute(
            array(
                'artist'      => $artist,
                'title'       => $title,
                'lastplayed'  => $lastvisit,
                'lastplay_ip' => $_SERVER ['REMOTE_ADDR']
            )
        );
        $track = $this->readChartForUpdate($artist, $title);
        return $track;
    }

    private function readChartForUpdate($artist, $title) {
        $this->statements ['SELECT_TRACKPLAY_BY_TRACK']->execute(
            array('artist' => $artist, 'title' => $title)
        );
        $data = $this->statements['SELECT_TRACKPLAY_BY_TRACK']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) return -1;
        return $data[0];
    }


    /**
     * @param $string
     * @return string
     */
    public function normalizeTitle($string) {
        if ($this->replaceTitleMap === null) {
            $this->replaceTitleMap = $this->query('LOAD_TITLE_REPLACEMENTS');
        }

        if (!is_array($this->replaceTitleMap)) {
            return $string;
        }

        for ($rcnt = 0; $rcnt < sizeof($this->replaceTitleMap); $rcnt++) {
            $row    = $this->replaceTitleMap[$rcnt];
            $string = (trim(str_replace($row['orig'], $row['repl'], $string)));
        }

        return $string;
    }
}
