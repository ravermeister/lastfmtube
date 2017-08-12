<?php

class DB {

	private static $instance;

	private $pdo = false;
	private $settings;
	


	private function __construct($file = false) {
	    if($file===false) $file=dirname(__FILE__).'/../conf/settings.ini';
	    if (!$this->settings = parse_ini_file($file, TRUE)) throw new exception('Unable to open ' . $file . '.');
	    $this->connect();
	}

        public static function getInstance() {
                if ( is_null( self::$instance ) ) {
                        self::$instance = new DB();
                }
                return self::$instance;
        }
	public function isConnected(){
		return $this->pdo !== false;
	}
	public function connect() {
		if($this->isConnected()) return;

		$this->pdo = new PDO($this->settings['database']['dsn'], $this->settings['database']['username'], $this->settings['database']['password']);
		$this->createdb();
	}


	private function validate() {
		$this->connect();
		$prefix = $this->settings['database']['table_prefix'];
		$valid = $this->tableExists($prefix.'charts') &&
			 $this->tableExists($prefix.'charts_lastfm_user') &&
			 $this->tableExists($prefix.'playlists') &&
			 $this->tableExists($prefix.'envvars');

		return $valid;
	}
    
	public function createdb() {
		if($this->validate()) return;

                $this->connect();
		$prefix = $this->settings['database']['table_prefix'];
		$this->pdo->exec(
			'DROP TABLE IF EXISTS "'.$prefix.'charts"'
		);
		$this->pdo->exec(
			'CREATE TABLE "'.$prefix.'charts" (
				"interpret" 	VARCHAR(500) 	NOT NULL,
				"title" 	VARCHAR(500) 	NOT NULL,
				"playcount" 	INTEGER 	NOT NULL,
				"lastplay_time" DATETIME 	NOT NULL,
				"lastplay_user" INTEGER 	NOT NULL,
				"lastplay_ip" 	VARCHAR(50) 	NOT NULL
			)'
		);


                $this->pdo->exec(
                        'DROP TABLE IF EXISTS "'.$prefix.'charts_lastfm_user"'
                );
		$this->pdo->exec(
			'CREATE TABLE "'.$prefix.'charts_lastfm_user" (
				"lastfm_user" 	VARCHAR(250) 	NOT NULL,
				"last_played" 	DATETIME 	NOT NULL,
				"playcount" 	INTEGER 	NOT NULL,
				PRIMARY KEY ("lastfm_user")
			)'
		);



                $this->pdo->exec(
                        'DROP TABLE IF EXISTS "'.$prefix.'playlists"'
                );
                $this->pdo->exec(
                        'CREATE TABLE "'.$prefix.'playlists" (
				"user_id"	INTEGER 	NOT NULL,
				"interpret"	VARCHAR(500)	NOT NULL,
				"title"		VARCHAR(500)	NOT NULL,
				"video_id"	VARCHAR(50)	NOT NULL
                        )'
                );


                $this->pdo->exec(
                        'DROP TABLE IF EXISTS "'.$prefix.'envvars"'
                );
                $this->pdo->exec(
                        'CREATE TABLE "'.$prefix.'envvars" (
				"key"		VARCHAR(250)	NOT NULL,
				"value"		VARCHAR(500)	NOT NULL,
				PRIMARY KEY("key")
                        )'
                );
	}

	/**
	 * Check if a table exists in the current database.
	 *
	 * @param PDO $pdo PDO instance connected to a database.
	 * @param string $table Table to search for.
	 * @return bool TRUE if table exists, FALSE if no table found.
	 */
	private function tableExists($table) {

	    // Try a select statement against the table
	    // Run it in try/catch in case PDO is in ERRMODE_EXCEPTION.
	    try {
	        $result = $this->pdo->query("SELECT 1 FROM $table LIMIT 1");
	    } catch (Exception $e) {
	        // We got an exception == table not found
	        return FALSE;
	    }

	    // Result is either boolean FALSE (no table found) or PDOStatement Object (table found)
	    return $result !== FALSE;
	}




	public function updateLastFMUserVisit($user, $ignoreCase=true) {
		$prefix = $this->settings['database']['table_prefix'];
		if($ignoreCase) $user = strtolower($user);
		
		$upres = $this->pdo->exec(
			'UPDATE "'.$prefix.'charts_lastfm_user" 
			SET
			"playcount"="playcount"+1,
			"last_played"=\''.date('Y-m-d H:i:s').'\'
			WHERE "lastfm_user"=\''.$user.'\''
		);
		
		if($upres!==false && $upres==1) return;

                $upres = $this->pdo->exec(
                        'INSERT INTO "'.$prefix.'charts_lastfm_user"
                        VALUES(\''.$user.'\', \''.date('Y-m-d H:i:s').'\', 1)'
                );				
		
	}

        public function updateCharts($track, $uid=0) {
                $prefix = $this->settings['database']['table_prefix'];
		
                $upres = $this->pdo->exec('
        	    UPDATE "'.$prefix.'charts"
	            SET
        	        "playcount"="playcount"+1,
                	"lastplay_time"=\''.date('Y-m-d H:i:s').'\',
	                "lastplay_user"='.$uid.',
        	        "lastplay_ip"=\''.$_SERVER['REMOTE_ADDR'].'\'

	            WHERE
        	        "interpret"=\''.$track['artist'].'\' AND
	                "title"=\''.$track['title'].'\';
		');
		
                if($upres!==false && $upres==1) return;
		
                $upres = $this->pdo->exec('
			INSERT INTO "'.$prefix.'charts"
			VALUES(
				\''.$track['artist'].'\',
				\''.$track['title'].'\',
				1,
				\''.date('Y-m-d H:i:s').'\',
				'.$uid.',
				\''.$_SERVER['REMOTE_ADDR'].'\'
			);
		');
        }


	public function getEnvVar($needle) {
		$prefix = $this->settings['database']['table_prefix'];
		$result = $this->pdo->query(
			'SELECT "value" FROM "'.$prefix.'envvars" 
			WHERE "key"=\''.$needle.'\'',
			PDO::FETCH_ASSOC
		);

		if($result===false) return '';

		$data = $result->fetch();
		return $data['value'];
		
	}
	
	public function delEnvVar($key) {
		$prefix = $this->settings['database']['table_prefix'];			
		$res = $this->pdo->exec(
			'DELETE FROM "'.$prefix.'envvars" 
			WHERE "key"=\''.$key.'\''
		);	
		return $res!==false && $res==1;		
	}
	
	public function setEnvVar($key,$value) {
		$prefix = $this->settings['database']['table_prefix'];
		$res = $this->pdo->exec(
			'INSERT INTO "'.$prefix.'envvars" 
			VALUES (\''.$key.'\',\''.$value.'\');'
		);
		return $res!==false && $res==1;	
	}

	public function query($sql) {
                $result = $this->pdo->query($sql, PDO::FETCH_ASSOC);
		if($result===false) return false;
		$resdata = array();
		while(($data = $result->fetch())!==false) {
			$resdata[] = $data;			
		}
		return $resdata;
	}
}




?>
