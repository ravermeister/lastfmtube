<?php

namespace LastFmTube\Util;

use Exception;
use PDO;

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
     * @var array|string
     */
    private $settings;

    /**
     * @var array|\PDOStatement
     */
    private $statements = false;

    /**
     * Db constructor.
     * @param bool $file
     * @throws Exception
     */
    private function __construct($file = false) {
        if ($file === false) $file = dirname(__FILE__) . '/../../conf/settings.ini';
        if (!$this->settings = parse_ini_file($file, true)) throw new exception ('Unable to open ' . $file . '.');
        $this->connect();
        $this->prepareQueries();
        $this->loadEnvVars();
    }

    public function connect() {
        if ($this->isConnected()) return;

        $this->pdo = new PDO ($this->settings ['database'] ['dsn'], $this->settings ['database'] ['username'],
                              $this->settings ['database'] ['password']
        );
        $this->createdb();
    }

    public function isConnected() {
        return $this->pdo !== false;
    }

    public function createdb() {
        if ($this->validate()) return;

        $this->connect();
        $prefix = $this->settings ['database'] ['table_prefix'];
        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'charts"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'charts" (
				interpret 	    VARCHAR(500) 	NOT NULL,
				title 	        VARCHAR(500) 	NOT NULL,
				playcount 	    INTEGER     	NOT NULL,
				lastplay_time   DATETIME        NOT NULL,
				lastplay_user   INTEGER 	    NOT NULL,
				lastplay_ip 	VARCHAR(50) 	NOT NULL,
				
				PRIMARY KEY (interpret, title, lastplay_time)
			)'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'charts_lastfm_user"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'charts_lastfm_user" (
				lastfm_user 	VARCHAR(250) 	NOT NULL,
				last_played 	DATETIME 	    NOT NULL,
				playcount 	    INTEGER 	    NOT NULL,
				PRIMARY KEY (lastfm_user)
			)'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'playlists"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'playlists" (
				user_id 	INTEGER 	    NOT NULL,
				interpret	VARCHAR(500)	NOT NULL,
				title		VARCHAR(500)	NOT NULL,
				video_id	VARCHAR(50)	    NOT NULL,
				
				PRIMARY KEY (user_id, interpret, title)
            )'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'envvars"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'envvars" (
				type        VARCHAR(50)     NOT NULL DEFAULT "YTVIDEO",
				key		    VARCHAR(250)	NOT NULL,
				value		VARCHAR(500)	NOT NULL,
				PRIMARY KEY("key", "type")
            )'
        );
    }

    private function validate() {
        $this->connect();
        $prefix = $this->settings ['database'] ['table_prefix'];
        $valid  = $this->tableExists($prefix . 'charts') && $this->tableExists($prefix . 'charts_lastfm_user') &&
                  $this->tableExists($prefix . 'playlists') && $this->tableExists($prefix . 'envvars');

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
				SELECT lastfm_user, last_played, playcount						
				FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user"	
				ORDER BY 
					playcount DESC,
					last_played DESC
				LIMIT :limit OFFSET :offset;
			',

            'SELECT_ALL_LASTFM_USER_NUM_ROWS' => '
				SELECT COUNT(*)	AS CNT					
				FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user";
			',

            'SELECT_LASTFM_USER_VISIT' => '
                WITH chart_user AS (
                    SELECT * FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user"
                    WHERE lastfm_user = :user
                ), chart_count AS (
                    SELECT * 
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user" mc, chart_user cu
                        WHERE mc.playcount < cu.playcount OR (
                        mc.playcount = cu.playcount AND 
                        mc.last_played < cu.last_played
                    )
                )
                SELECT ((SELECT COUNT(*) 
                        FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user") - COUNT(*)
                    ) AS pos, cu.*
                FROM chart_count ck, chart_user cu
			',

            'UPDATE_LASTFM_USER_VISIT' => '
				UPDATE "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user" 
				SET
				playcount=playcount+1,
				last_played= :lastplayed
				WHERE lastfm_user= :lastfm_user;
			',

            'INSERT_LASTFM_USER_VISIT' => '
				INSERT INTO "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user" 
				(lastfm_user, last_played, playcount) 
				VALUES(:lastfm_user, :last_played, 1);
			',

            'UPDATE_CHARTS' => '
			    UPDATE "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			    SET
				"playcount"="playcount"+1,
				lastplay_time= :lastplay_time,
				lastplay_user= :lastplay_user,
				lastplay_ip= :lastplay_ip

			    WHERE
				interpret= :interpret AND
				title= :title;
			',

            'INSERT_CHARTS' => '
			    INSERT INTO "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			    (interpret, title, playcount, lastplay_time, lastplay_user, lastplay_ip)
			    VALUES(:interpret, :title, 1, :lastplay_time, :lastplay_user, :lastplay_ip);
			',

            'SELECT_CHARTS'          => '
				SELECT * FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			     ORDER BY playcount DESC, lastplay_time DESC 
			     LIMIT :limit OFFSET :offset;
			',
            'SELECT_CHARTS_NUM_ROWS' => '
                SELECT COUNT(*) AS "CNT" FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts";
            ',

            'SELECT_CHART_COUNT_TRACK' => '
                WITH chart_track AS (
                    SELECT *
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts"
                    WHERE interpret= :interpret AND title= :title
                ), chart_count AS (
                    SELECT *
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts" mc, chart_track ct
                    WHERE mc.playcount < ct.playcount OR (
                        mc.playcount = ct.playcount AND 
                        mc.lastplay_time < ct.lastplay_time
                    )	
                )
                SELECT ((SELECT COUNT(*) 
                        FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts") - COUNT(*)
                    ) AS pos, ct.*
                FROM chart_count ck, chart_track ct  
            ',
            // SELECT ONLY the last heared song with playcount 1
            // 'SELECT_CHARTS' =>
            // '
            // SELECT * FROM "'.$this->settings['database']['table_prefix'].'charts"
            // WHERE ("playcount" > 1) OR (
            // "playcount" = 1 AND
            // lastplay_time IN (
            // SELECT MAX(lastplay_time)
            // FROM "'.$this->settings['database']['table_prefix'].'charts"
            // WHERE "playcount"=1
            // )
            // )
            // ORDER BY playcount DESC, lastplay_time` DESC;
            // ',


            'GET_ENVVAR' => '
				SELECT value FROM "' . $this->settings ['database'] ['table_prefix'] . 'envvars" 
				WHERE type = :type AND key = :key;
			',

            'DEL_ENVVAR' => '
				DELETE FROM "' . $this->settings ['database'] ['table_prefix'] . 'envvars" 
				WHERE type = :type AND key = :key;
			',

            'SET_ENVVAR' => '
				REPLACE INTO "' . $this->settings ['database'] ['table_prefix'] . 'envvars"  
				VALUES (:type, :key, :value);
			',

            'SEARCH_CHARTS_TRACK' => '
                SELECT * FROM "' . $this->settings['database']['table_prefix'] . 'charts_track_alias" 
                WHERE interpret LIKE ? OR title LIKE ?;
            '
        );

        foreach ($this->statements as $prefix => $query) {
            $this->statements [$prefix] = $this->pdo->prepare($query);
        }
    }

    private function loadEnvVars() {
        $funcs     = Functions::getInstance();
        $csvfn     = $funcs->getSettings()['general']['vars_csv'];
        $csvsha    = sha1_file($csvfn);
        $saved_sha = $this->getEnvVar('VARS_CSV_SHA', 'DB_VARS_CSV');
        if (strcmp($csvsha, $saved_sha) === 0) {
            return; //file has not changed
        }
        Functions::getInstance()->logMessage('vars.csv has changed importing new data.');

        $csvf = fopen($csvfn, 'r');
        if ($csvf === false) {
            $funcs->logMessage('no initial CSV File found for var import');
            return;
        }

        $rcnt = 0;
        while (($row = fgetcsv($csvf, 1000)) !== false) {
            if ($rcnt === 0) {
                $rcnt++;
                continue; //ignore header row
            }
            if (sizeof($row) < 3) {
                $funcs->logMessage('skiip row ' . ($rcnt + 1) . ' insufficient data');
                continue;
            }
            $key   = $row[1];
            $type  = $row[0];
            $value = $row[2];
            $this->setEnvVar($key, $value, $type);

            $rcnt++;
        }

        $this->setEnvVar('VARS_CSV_SHA', $csvsha, 'DB_VARS_CSV');
        $funcs->logMessage(($rcnt - 1) . ' rows imported');

    }

    public function getEnvVar($key, $type = 'YTVIDEO') {

        $result = $this->statements ['GET_ENVVAR']->execute(
            array(
                'type' => $type,
                'key'  => $key)
        );

        if ($result === false) return '';

        $data = $this->statements ['GET_ENVVAR']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) return '';
        return $data [0] ['value'];
    }

    public function setEnvVar($key, $value, $type = 'YTVIDEO') {
        $res = $this->statements ['SET_ENVVAR']->execute(
            array(
                'key'   => $key,
                'type'  => $type,
                'value' => $value
            )
        );
        return $res !== false && $res == 1;
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
        if (Functions::endsWith($queryName, '_NUM_ROWS')) {
            $data = $data[0]['CNT'];
        }

        return $data;
    }

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
                'user'        => $user,
                'last_played' => $curvisit
            )
        );
        return $this->readLastFMUserVisitForUpdate($origUser);

    }

    private function readLastFMUserVisitForUpdate($user) {
        Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->execute(array('user' => $user));
        $data = Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) {
            return array(
                'playcount'   => -1,
                'last_played' => ''
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

    public function updateCharts($track, $uid = 0) {
        $lastvisit = date('Y-m-d H:i:s');

        $upres = $this->statements ['UPDATE_CHARTS']->execute(
            array(
                'lastplay_time' => $lastvisit,
                'lastplay_user' => $uid,
                'lastplay_ip'   => $_SERVER ['REMOTE_ADDR'],
                'interpret'     => $track ['artist'],
                'title'         => $track ['title']
            )
        );
        if ($upres !== false && $this->statements ['UPDATE_CHARTS']->rowCount() == 1) {
            return $this->readChartForUpdate($track);
        }


        $this->statements ['INSERT_CHARTS']->execute(
            array(
                'interpret'     => $track ['artist'],
                'title'         => $track ['title'],
                'lastplay_time' => $lastvisit,
                'lastplay_user' => $uid,
                'lastplay_ip'   => $_SERVER ['REMOTE_ADDR']
            )
        );

        return $this->readChartForUpdate($track);
    }

    private function readChartForUpdate($track) {
        $this->statements ['SELECT_CHART_COUNT_TRACK']->execute(
            array('interpret' => $track['artist'], 'title' => $track['title'])
        );
        $data = $this->statements['SELECT_CHART_COUNT_TRACK']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) return -1;
        return $data[0];
    }

    public function delEnvVar($key, $type = 'YTVIDEO') {
        $res = $this->statements ['DEL_ENVVAR']->execute(array($type, $key));
        return $res !== false && $res == 1;
    }

}
