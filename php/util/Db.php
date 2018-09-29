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
				"interpret" 	VARCHAR(500) 	NOT NULL,
				"title" 	    VARCHAR(500) 	NOT NULL,
				"playcount" 	INTEGER     	NOT NULL,
				"lastplay_time" DATETIME 	    NOT NULL,
				"lastplay_user" INTEGER 	    NOT NULL,
				"lastplay_ip" 	VARCHAR(50) 	NOT NULL
			)'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'charts_track_alias"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'charts_track_alias" (
				"interpret" 	    VARCHAR(500) 	NOT NULL,
				"title" 	        VARCHAR(500) 	NOT NULL,				
                "interpret_alias" 	VARCHAR(500) 	NOT NULL,
				"title_alias" 	    VARCHAR(500) 	NOT NULL,				
			)'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'charts_lastfm_user"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'charts_lastfm_user" (
				"lastfm_user" 	VARCHAR(250) 	NOT NULL,
				"last_played" 	DATETIME 	NOT NULL,
				"playcount" 	INTEGER 	NOT NULL,
				PRIMARY KEY ("lastfm_user")
			)'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'playlists"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'playlists" (
				"user_id"	INTEGER 	NOT NULL,
				"interpret"	VARCHAR(500)	NOT NULL,
				"title"		VARCHAR(500)	NOT NULL,
				"video_id"	VARCHAR(50)	NOT NULL
                        )'
        );

        $this->pdo->exec('DROP TABLE IF EXISTS "' . $prefix . 'envvars"');
        $this->pdo->exec('CREATE TABLE "' . $prefix . 'envvars" (
				"key"		VARCHAR(250)	NOT NULL,
				"value"		VARCHAR(500)	NOT NULL,
				PRIMARY KEY("key")
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
				LIMIT ? OFFSET ?;
			',

            'SELECT_ALL_LASTFM_USER_NUM_ROWS' => '
				SELECT COUNT(*)	AS CNT					
				FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user";
			',

            'SELECT_LASTFM_USER_VISIT' => '
                WITH chart_user AS (
                    SELECT * FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user"
                    WHERE lastfm_user = ?
                ), chart_count AS (
                    SELECT * 
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user" mc, chart_user cu
                        WHERE mc.`playcount` < cu.`playcount` OR (
                        mc.`playcount` = cu.`playcount` AND 
                        mc.`last_played` < cu.`last_played`
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
				"playcount"="playcount"+1,
				"last_played"= ?
				WHERE "lastfm_user"= ?;
			',

            'INSERT_LASTFM_USER_VISIT' => '
				INSERT INTO "' . $this->settings ['database'] ['table_prefix'] . 'charts_lastfm_user" VALUES(?, ?, 1);
			',

            'UPDATE_CHARTS' => '
			    UPDATE "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			    SET
				"playcount"="playcount"+1,
				"lastplay_time"= ?,
				"lastplay_user"= ?,
				"lastplay_ip"= ?

			    WHERE
				"interpret"= ? AND
				"title"= ?;
			',

            'INSERT_CHARTS' => '
			    INSERT INTO "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			    VALUES(?, ?, 1, ?, ?, ?);
			',

            'SELECT_CHARTS'            => '
				SELECT * FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts"
			     ORDER BY `playcount` DESC, `lastplay_time` DESC LIMIT ? OFFSET ?;
			',
            'SELECT_CHARTS_NUM_ROWS'   => '
                SELECT COUNT(*) AS "CNT" FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts";
            ',
            'SELECT_CHART_COUNT_TRACK' => '
                WITH chart_track AS (
                    SELECT *
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts"
                    WHERE interpret= ? AND title= ?
                ), chart_count AS (
                    SELECT *
                    FROM "' . $this->settings ['database'] ['table_prefix'] . 'charts" mc, chart_track ct
                    WHERE mc.`playcount` < ct.`playcount` OR (
                        mc.`playcount` = ct.`playcount` AND 
                        mc.`lastplay_time` < ct.`lastplay_time`
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
            // "lastplay_time" IN (
            // SELECT MAX("lastplay_time")
            // FROM "'.$this->settings['database']['table_prefix'].'charts"
            // WHERE "playcount"=1
            // )
            // )
            // ORDER BY `playcount` DESC, `lastplay_time` DESC;
            // ',


            'GET_ENVVAR' => '
				SELECT "value" FROM "' . $this->settings ['database'] ['table_prefix'] . 'envvars" 
				WHERE "key"= ?;
			',

            'DEL_ENVVAR' => '
				DELETE FROM "' . $this->settings ['database'] ['table_prefix'] . 'envvars" 
				WHERE "key"= ?;
			',

            'SET_ENVVAR' => '
				REPLACE INTO "' . $this->settings ['database'] ['table_prefix'] . 'envvars"  VALUES (?, ?);
			',

            'SEARCH_CHARTS_TRACK' => '
                SELECT * FROM "' . $this->settings['database']['table_prefix'] . 'charts_track_alias" 
                WHERE "artist" LIKE ? OR "title" LIKE ?;
            '
        );

        foreach ($this->statements as $prefix => $query) {
            $this->statements [$prefix] = $this->pdo->prepare($query);
        }
    }

    public function updateLastFMUserVisit($user, $ignoreCase = true) {
        $origUser = $user;
        if ($ignoreCase) $user = strtolower($user);
        $curvisit = date('Y-m-d H:i:s');

        $upres = $this->statements ['UPDATE_LASTFM_USER_VISIT']->execute(array($curvisit, $user));
        if ($upres !== false && $this->statements ['UPDATE_LASTFM_USER_VISIT']->rowCount() == 1) {
            return $this->readLastFMUserVisitForUpdate($origUser);
        }


        $this->statements ['INSERT_LASTFM_USER_VISIT']->execute(array($user, $curvisit));
        return $this->readLastFMUserVisitForUpdate($origUser);

    }

    private function readLastFMUserVisitForUpdate($user) {
        Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->execute(array($user));
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
            array($lastvisit, $uid, $_SERVER ['REMOTE_ADDR'],
                  $track ['artist'], $track ['title'])
        );
        if ($upres !== false && $this->statements ['UPDATE_CHARTS']->rowCount() == 1) {
            return $this->readChartForUpdate($track);
        }


        $this->statements ['INSERT_CHARTS']->execute(
            array($track ['artist'], $track ['title'], $lastvisit, $uid,
                  $_SERVER ['REMOTE_ADDR'])
        );

        return $this->readChartForUpdate($track);
    }

    private function readChartForUpdate($track) {
        $this->statements ['SELECT_CHART_COUNT_TRACK']->execute(
            array($track['artist'], $track['title'])
        );
        $data = $this->statements['SELECT_CHART_COUNT_TRACK']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) return -1;
        return $data[0];
    }

    public function getEnvVar($needle) {

        $result = $this->statements ['GET_ENVVAR']->execute(array($needle));

        if ($result === false) return '';

        $data = $this->statements ['GET_ENVVAR']->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($data) < 1) return '';
        return $data [0] ['value'];
    }

    public function delEnvVar($key) {
        $res = $this->statements ['DEL_ENVVAR']->execute(array($key));
        return $res !== false && $res == 1;
    }

    public function setEnvVar($key, $value) {
        $res = $this->statements ['SET_ENVVAR']->execute(array($key, $value));
        return $res !== false && $res == 1;
    }

    public function query($queryName, ...$vars) {
        if (!isset ($this->statements [$queryName])) return false;
        $result = $this->statements [$queryName]->execute($vars);
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

}
