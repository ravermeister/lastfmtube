<?php
class Functions {

	private static $instance;	
	private $settings = false;
	private $settingsFile = false;
	
	private function __construct($file=false){
		$this->settingsFile = $file;
		$this->initSettings();
	}

	private function initSettings($force=false){
		if(!$force && is_array($this->settings)) return;
		
		if($this->settingsFile===false) $this->settingsFile=dirname(__FILE__).'/../conf/settings.ini';
		if (!$this->settings = parse_ini_file($this->settingsFile, TRUE)) throw new exception('Unable to open ' . $file . '.');
	}

	public static function getInstance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new Functions();
		}
		return self::$instance;
	}	

	public static function br2nl($text, $tags = "br") {
		$tags = explode(" ", $tags);

		foreach($tags as $tag) {
			$text = preg_replace("/<" . $tag . "[^>]*>/i", "\n", $text);
			$text = preg_replace("/<\/" . $tag . "[^>]*>/i", "\n", $text);
		}

		return($text);
	}

	public function startSession() {
		$started = false;
		if ( php_sapi_name() !== 'cli' ) {
			if ( version_compare(phpversion(), '5.4.0', '>=') ) $started = session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;			
			else  $started = session_id() === '' ? FALSE : TRUE;		
		}
		$started = FALSE;
		if($started) return;
		session_start();
	}


	public function logMessage($msg) {
		Functions::getInstance()->initSettings();
		$logfile = fopen(Functions::getInstance()->settings['general']['logpath'],'a+');

		$prefix = date('d.m.Y H:i:s');
		$msgArr = explode("\n",Functions::br2nl($msg));
		for($i=0;$i<sizeof($msgArr);$i++) {
			if(strlen($msgArr[$i]) > 0)
				fwrite($logfile,$prefix."\t".$msgArr[$i]."\r\n");
		}
		fclose($logfile);
	}
	
	public function loadLangFile() {
		return parse_ini_file(
			dirname(__FILE__).'/../locale/locale_'.
			Functions::getInstance()->settings['general']['lang'].'.properties'
		);
	}
	
	public function saveConfig($config=false){	
		
		$fh = fopen(dirname(__FILE__).'/../conf/settings.ini', 'w');				
		fwrite($fh, 
			"; you need to have a registered last.fm user with a developer API\n\n".
			"['general']\n".
			"baseurl = ".$config['general']['baseurl']."\n".
			"; possible values = de,en\n".
			"lang = ".$config['general']['lang']."\n".
			";path to log file\n".
			"logpath = ".$config['general']['logpath']."\n".
			";youtube player width and height (relative or absolte)\n".
			"playerwidth = ".$config['general']['playerwidth']."\n".
			"playerheight = ".$config['general']['playerheight']."\n".
			"; themes/mytheme must exist, possible values 'default','dark'\n".
			"theme = ".$config['general']['theme']."\n".
			";Conext Menu Theme name. Included themes are: 'default','xp','vista','osx','human','gloss'\n".
			";Multiple themes may be applied with a comma-separated list.\n".
			"cmenutheme = ".$config['general']['cmenutheme']."\n".
			"; the default last.fm user when initally loading the playlist\n".
			"lastfm_defaultuser = ".$config['general']['lastfm_defaultuser']."\n".
			"; the Admin Password as sha1_value (default is lfmtube)\n".
			"adminpw = ".$config['general']['adminpw'].
			"\n".
			";[database]\n".
			";dsn = mysql:host=127.0.0.1;port=3306;dbname=lasttube;charset=UTF8;\n".
			";table_prefix = music_\n".
			";username = lastuser\n".
			";password = l4stp4$$\n".
			"\n".
			"[database]\n".
			"dsn = ".$config['database']['dsn']."\n".
			"table_prefix = ".$config['database']['table_prefix']."\n".
			"username = ".$config['database']['username']."\n".
			"password = ".$config['database']['password']."\n".
			"\n".
			"[lastfm]\n".
			"; the lastfm user with the developer API Key\n".
			"user = ".$config['lastfm']['user']."\n".
			"; the lastfm user developer API Key\n".
			"apikey = ".$config['lastfm']['apikey']."\n".
			"\n".
			"[youtube]\n".
			"apikey = ".$config['youtube']['apikey']."\n".
			"; required for OAuth Login (not yet supported)\n".
			";email = 755183333407-8a5huo8gk68uenschgvg1vpmdbj9c18r@developer.gserviceaccount.com\n".
			";keyfile = /home/ravermeister/lastfm.rimkus.it/conf/youtube.p12\n".
			";user = info@rimkus.it\n"
		);
		fclose($fh);
		Functions::getInstance()->initSettings(true);
	}

}
?>
