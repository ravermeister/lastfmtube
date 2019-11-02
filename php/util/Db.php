<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Util;

use Exception;
use PDO;
use PDOException;
use PDOStatement;

/**
 * Class Db
 *
 * @package LastFmTube\Util
 */
class Db {

     /**
      *
      * @var string
      */
     public static $ARTIST_REGEX = "__ARTIST_REGEX";

     /**
      *
      * @var string
      */
     public static $TITLE_REGEX = "__TITLE_REGEX";

     /**
      *
      * @var Db
      */
     private static $instance;

     /**
      *
      * @var PDO
      */
     private $pdo = false;

     /**
      *
      * @var array|PDOStatement
      */
     private $statements = false;

     /**
      * replacement map from db (hold in ram for perfomance)
      *
      * @var array
      */
     private $replaceTrackMap = null;

     /**
      * Db constructor.
      * @throws Exception
      */
     private function __construct() {
          $this->connect();
          $this->prepareQueries();
          // activate use of foreign key constraints
          $this->pdo->exec('PRAGMA foreign_keys = ON;');

          // activate timeout for parallel use
          $this->pdo->exec('PRAGMA busy_timeout = 200');
     }

     public function connect() {
          if ($this->isConnected()) return;
          $settings = Functions::getInstance()->getSettings();
          $this->pdo = new PDO($settings['database']['dsn']);
          $this->createdb();
     }

     public function isConnected() {
          return $this->pdo !== false;
     }

     /**
      *
      * @return bool
      */
     public function createdb() {
          if ($this->validate()) return false;
          $this->connect();
          $sqlf = file_get_contents(Functions::getInstance()->getSettings()['database']['dbinit_file']);
          if ($sqlf === false) {
               Functions::getInstance()->logMessage('Error could not open initdb sql file');
               return $sqlf;
          }

          $this->pdo->exec($sqlf);
          return true;
     }

     private function validate() {
          $this->connect();
          $valid = $this->tableExists('trackplay') && $this->tableExists('lfmuserplay') && $this->tableExists('fimport') && $this->tableExists('replacement');

          return $valid;
     }

     /**
      * Check if a table exists in the current database.
      *
      * @param string $table
      *             Table to search for.
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
				SELECT COUNT(*) AS cnt					
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
                     FROM chart_count ck, chart_user cu;
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

               'SELECT_TRACKPLAY' => '
                    SELECT artist, title, playcount, lastplayed, lastplay_ip, url
                    FROM trackplay
                    WHERE playcount > 0
                    ORDER BY :orderby DESC, :orderbysecond DESC
                    LIMIT :limit OFFSET :offset;
			',

               'SELECT_TRACKPLAY_NUM_ROWS' => '
                    SELECT COUNT(*) AS cnt FROM trackplay;
               ',

               'SELECT_TRACKPLAY_BY_TRACK' => '
                    SELECT artist, title, playcount, lastplayed, lastplay_ip, url 
                    FROM trackplay
                    WHERE artist =:artist AND title = :title;
               ',

               'GET_VIDEO' => '
				SELECT url FROM trackplay 
				WHERE artist = :artist AND title = :title;
			',

               'EDIT_VIDEO' => '
				UPDATE trackplay 
				SET url = :url
				WHERE artist = :artist AND title = :title;
			',

               'DELETE_VIDEO' => '
                     UPDATE trackplay
                     SET url = NULL 
                     WHERE artist = :artist AND title = :title;
               ',

               'ADD_VIDEO' => '
				INSERT INTO trackplay (artist, title, url) 
                    VALUES (:artist, :title, :url);
			',

               'LOAD_REPLACEMENTS' => '
                    SELECT orig_artist_expr, orig_title_expr, repl_artist, repl_title  
                    FROM replacement;
               ',

               'INSERT_REPLACEMENT' => '
                    INSERT INTO replacement(import_file_sha, orig_artist_expr, orig_title_expr, repl_artist, repl_title) 
                    VALUES (:import_file_sha, :orig_artist_expr, :orig_title_expr, :repl_artist, :repl_title);
               ',

               'SELECT_FIMPORT_SHA' => '
                SELECT shasum FROM fimport WHERE fname = :fname
               ',

               'DELETE_FIMPORT' => '
                DELETE FROM fimport WHERE shasum = :shasum
               ',

               'INSERT_FIMPORT' => '
                INSERT INTO fimport VALUES(:fname, :shasum)
               ',

               'SET_FIMPORT' => '
                REPLACE INTO fimport VALUES(:fname, :shasum)
               '
          );

          foreach ($this->statements as $prefix => $query) {
               $this->statements[$prefix] = $this->pdo->prepare($query);
               if ($this->statements[$prefix] === false) {
                    Functions::getInstance()->logMessage('error creating query: ' . $query);
                    Functions::getInstance()->logMessage('>>>' . print_r($this->pdo->errorInfo(), true));
               }
          }
     }

     public function importReplacementCSV($csvFile) {
          $funcs = Functions::getInstance();
          $csvsha = sha1_file($csvFile);
          $saved_sha = $this->query('SELECT_FIMPORT_SHA', array(
               'fname' => basename($csvFile)
          ));
          $saved_sha = is_array($saved_sha) && isset($saved_sha['shasum']) ? $saved_sha['shasum'] : '';
          if (strcmp($csvsha, $saved_sha) === 0) {
               return - 1; // file has not changed
          }

          Functions::getInstance()->logMessage($csvFile . ' has changed importing new data.');
          $csvf = fopen($csvFile, 'r');
          if ($csvf === false) {
               $funcs->logMessage('replacement csv file ' . $csvFile . ' not found');
               return false;
          }

          $pdoErrorMode = $this->pdo->getAttribute(PDO::ATTR_ERRMODE);
          $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          $this->pdo->beginTransaction();

          if (strlen($saved_sha) > 0) {
               $this->query('DELETE_FIMPORT', array(
                    'shasum' => $saved_sha
               ));
          }

          $this->query('INSERT_FIMPORT', array(
               'fname' => basename($csvFile),
               'shasum' => $csvsha
          ));
          $rowsImported = 0;
          $rowsProcessed = 0;

          while (($row = fgetcsv($csvf, 10000)) !== false) {

               $rowsProcessed ++;
               if (Functions::startsWith($row[0], '#')) {
                    $funcs->logMessage('skip row ' . $rowsProcessed . ' as it is a comment row');
                    continue; // ignore comment rows
               }
               if (sizeof($row) == 0 || strlen($row[0] === 0)) {
                    $funcs->logMessage('skip row ' . $rowsProcessed . ' empty row');
                    continue; // ignore empty rows
               }
               if (sizeof($row) < 4) {
                    $funcs->logMessage('skip row ' . $rowsProcessed . ' insufficient data');
                    continue;
               }

               $orig_artist_expr = $row[0];
               $orig_title_expr = $row[1];
               $repl_artist = $row[2];
               $repl_title = $row[3];

               try {
                    $this->query('INSERT_REPLACEMENT', array(
                         'import_file_sha' => $csvsha,
                         'orig_artist_expr' => $orig_artist_expr,
                         'orig_title_expr' => $orig_title_expr,
                         'repl_artist' => $repl_artist,
                         'repl_title' => $repl_title
                    ));
               } catch (PDOException $error) {
                    $funcs->logMessage('Error inserting replacement in db');
                    $funcs->logMessage($error->getMessage());
                    continue;
               }

               $rowsImported ++;
          }

          $this->pdo->setAttribute(PDO::ATTR_ERRMODE, $pdoErrorMode);
          $this->pdo->commit();

          $funcs->logMessage($rowsImported . ' rows imported');
          return $rowsImported;
     }

     public function query($queryName, $namedParms = array()) {
          if (! isset($this->statements[$queryName])) return false;
          $result = $this->statements[$queryName]->execute($namedParms);
          if ($result === false) {
               $error = $this->statements[$queryName]->errorInfo();
               if ($error != null && $error !== false) {
                    Functions::getInstance()->logMessage('DB Error occured:');
                    Functions::getInstance()->logMessage(print_r($error, true));
               }

               Functions::getInstance()->logMessage($this->statements[$queryName]->errorInfo());
               return false;
          }

          $data = $this->statements[$queryName]->fetchAll(PDO::FETCH_ASSOC);
          if (sizeof($data) <= 0) {
               return $this->statements[$queryName]->rowCount();
          } else if (sizeof($data) === 1 && (Strings::endsWith($queryName, '_NUM_ROWS') || strcmp($queryName, 'SELECT_FIMPORT_SHA') === 0)) {
               return $data[0];
          }
          return $data;
     }

     public static function getVersion() {
          $dbh = new PDO('sqlite::memory:');
          $data = $dbh->query('select sqlite_version()')->fetch()[0];
          $dbh = null;
          return $data;
     }

     /**
      *
      * @param
      *             $user
      * @param bool $ignoreCase
      * @return array
      * @throws Exception
      */
     public function updateLastFMUserVisit($user, $ignoreCase = true) {
          $origUser = $user;
          if ($ignoreCase) $user = strtolower($user);
          $curvisit = date('Y-m-d H:i:s');

          $upres = $this->statements['UPDATE_LASTFM_USER_VISIT']->execute(array(
               'lastplayed' => $curvisit,
               'lfmuser' => $user
          ));
          if ($upres !== false && $this->statements['UPDATE_LASTFM_USER_VISIT']->rowCount() == 1) {
               return $this->readLastFMUserVisitForUpdate($origUser);
          }
          $this->statements['INSERT_LASTFM_USER_VISIT']->execute(array(
               'lfmuser' => $user,
               'lastplayed' => $curvisit
          ));
          return $this->readLastFMUserVisitForUpdate($origUser);
     }

     /**
      *
      * @param
      *             $user
      * @return array
      * @throws Exception
      */
     private function readLastFMUserVisitForUpdate($user) {
          Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->execute(array(
               'user' => $user
          ));
          $data = Db::getInstance()->statements['SELECT_LASTFM_USER_VISIT']->fetchAll(PDO::FETCH_ASSOC);
          if (sizeof($data) < 1) {
               return array(
                    'playcount' => - 1,
                    'lastplayed' => ''
               );
          }

          return $data[0];
     }

     /**
      *
      * @return Db
      * @throws Exception
      */
     public static function getInstance() {
          if (is_null(self::$instance)) {
               self::$instance = new static();
          }
          return self::$instance;
     }

     public function updateTrackPlay($artist, $title) {
          $lastvisit = date('Y-m-d H:i:s');

          $upres = $this->statements['UPDATE_TRACKPLAY']->execute(array(
               'lastplayed' => $lastvisit,
               'lastplay_ip' => $_SERVER['REMOTE_ADDR'],
               'artist' => $artist,
               'title' => $title
          ));
          if ($upres !== false && $this->statements['UPDATE_TRACKPLAY']->rowCount() == 1) {
               return $this->readChartForUpdate($artist, $title);
          }

          $this->statements['INSERT_TRACKPLAY']->execute(array(
               'artist' => $artist,
               'title' => $title,
               'lastplayed' => $lastvisit,
               'lastplay_ip' => $_SERVER['REMOTE_ADDR']
          ));
          $track = $this->readChartForUpdate($artist, $title);
          return $track;
     }

     private function readChartForUpdate($artist, $title) {
          $this->statements['SELECT_TRACKPLAY_BY_TRACK']->execute(array(
               'artist' => $artist,
               'title' => $title
          ));
          $data = $this->statements['SELECT_TRACKPLAY_BY_TRACK']->fetchAll(PDO::FETCH_ASSOC);
          if (sizeof($data) < 1) return - 1;
          return $data[0];
     }

     public function getReplaceTrackMap($reload = false) {
          if ($this->replaceTrackMap === null || $reload) {
               $this->replaceTrackMap = $this->query('LOAD_REPLACEMENTS');
          }
          return $this->replaceTrackMap;
     }
}
