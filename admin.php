<?php
	require_once 'includes/bootstrap.php';

	//enter a sha1 password (default is lfmtube)
	$sha1_password = '8e86808ce4d6f7ed6d0a0b8bf0de8e366106a9c7';
	$smarty->assign('ADMIN_AUTHORIZED', false);
	if(!isset($_SESSION['admin']['password'])||strcmp($sha1_password, $_SESSION['admin']['password']) != 0) {
		$return = true;
		if(isset($_POST['submit']) && isset($_POST['password'])) {
			unset($_POST['submit']);

			if(strlen(trim($_POST['password'])) > 0){
				$pwhash = sha1($_POST['password']);
				if(strcmp($sha1_password, $pwhash) == 0) {
					$return = false;
					$_SESSION['admin']['password'] = $pwhash;
				}
			}
		}

		if($return) {
			$smarty->display('admin.tpl');
			return;
		}
	} //login




	if(isset($_POST['submit'])) {
		//die(print_r($_POST));
		$replace_strings = $_POST['replace_strings'];
		//$replace_strings = Functions::br2nl($replace_strings);
		$replace_strings = strip_tags($replace_strings);
		file_put_contents('conf/replace_strings.txt', $replace_strings);
		//replace_strings.txt

		if(strlen(trim(strip_tags($_POST['general_baseurl']))) > 0 ) $settings['general']['baseurl'] = $_POST['general_baseurl'];		
		if(strlen(trim(strip_tags($_POST['general_lang']))) > 0 ) $settings['general']['lang'] = $_POST['general_lang']; 
		if(strlen(trim(strip_tags($_POST['general_logpath']))) > 0 ) $settings['general']['logpath'] = $_POST['general_logpath'];
		if(strlen(trim(strip_tags($_POST['general_playerwidth']))) > 0 ) $settings['general']['playerwidth'] = $_POST['general_playerwidth'];
		if(strlen(trim(strip_tags($_POST['general_playerheight']))) > 0 ) $settings['general']['playerheight'] = $_POST['general_playerheight'];

		if(strlen(trim(strip_tags($_POST['general_theme']))) > 0 ) $settings['general']['theme'] = $_POST['general_theme'];
		if(strlen(trim(strip_tags($_POST['general_cmenutheme']))) > 0 ) $settings['general']['cmenutheme'] = $_POST['general_cmenutheme'];
		if(strlen(trim(strip_tags($_POST['general_lastfm_defaultuser']))) > 0 ) $settings['general']['lastfm_defaultuser'] = $_POST['general_lastfm_defaultuser'];
		//general settings

		if(strlen(trim(strip_tags($_POST['database_dsn']))) > 0 ) $settings['database']['dsn'] = $_POST['database_dsn'];
		if(strlen(trim(strip_tags($_POST['database_table_prefix']))) > 0 ) $settings['database']['table_prefix'] = $_POST['database_table_prefix'];
		if(strlen(trim(strip_tags($_POST['database_username']))) > 0 ) $settings['database']['username'] = $_POST['database_username'];
		if(strlen(trim(strip_tags($_POST['database_password']))) > 0 ) $settings['database']['password'] = $_POST['database_password'];
		//database settings

		if(strlen(trim(strip_tags($_POST['lastfm_user']))) > 0 ) $settings['lastfm']['user'] = $_POST['lastfm_user'];
		if(strlen(trim(strip_tags($_POST['lastfm_apikey']))) > 0 ) $settings['lastfm']['apikey'] = $_POST['lastfm_apikey'];
		//lastfm

		if(strlen(trim(strip_tags($_POST['youtube_apikey']))) > 0 ) $settings['youtube']['apikey'] = $_POST['youtube_apikey'];
		if(strlen(trim(strip_tags($_POST['youtube_email']))) > 0 ) $settings['youtube']['email'] = $_POST['youtube_email'];
		if(strlen(trim(strip_tags($_POST['youtube_keyfile']))) > 0 ) $settings['youtube']['keyfile'] = $_POST['youtube_keyfile'];
		if(strlen(trim(strip_tags($_POST['youtube_user']))) > 0 ) $settings['youtube']['user'] = $_POST['youtube_user'];
		//youtube

		Functions::getInstance()->saveConfig($settings);

		$smarty->setTemplateDir(dirname(__FILE__).'/themes/'.$settings['general']['theme']);
		$smarty->setCacheDir(dirname(__FILE__).'/tmp/smarty/cache');
		$smarty->setCompileDir(dirname(__FILE__).'/tmp/smarty/compile');
	}


	$replace_strings = file_get_contents('conf/replace_strings.txt');
	//$replace_strings = nl2br($replace_strings);

	$locales = file('locale/locale.info');
	for($row=0; $row<count($locales); $row++) {
		$line = $locales[$row];
		$larr = explode(' ', $line);
		$value = '';
		$desc = '';

		if($larr>0) $value = $larr[0];
		if($larr>1) {
			for($cnt=1; $cnt<count($larr); $cnt++){
				$desc.=$larr[$cnt];
				if($cnt<(count($larr)-1)) $desc.=' ';
			}
		}

		$supported_locales[$row]['value'] = $value;
		$supported_locales[$row]['desc'] = $desc;
	}
	//supported locales
	$themedir = 'themes/*';
	foreach(glob($themedir, GLOB_ONLYDIR) as $name) {
		$supported_themes[] = basename($name);
	}
	//supported themes

	if(isset($_GET['check_requirements'])) {

		$data['req_php_version'] = version_compare(phpversion(),'5.6.0');
		$data['req_db_pdo'] = extension_loaded('pdo_sqlite')||extension_loaded('pdo_mysql');


		$data['req_yt_api'] = strlen(trim($settings['youtube']['apikey'])) > 0;
		$data['req_lfm_api'] = (strlen(trim($settings['lastfm']['apikey'])) > 0) && (strlen(trim($settings['lastfm']['user'])) > 0);
		$data['req_db_con'] = DB::getInstance()->isConnected();

		die(json_encode($data));
	}

	$smarty->assign('ADMIN_AUTHORIZED', true);
	$smarty->assign('REPLACE_STRINGS_FILE',$replace_strings);
	$smarty->assign('SUPPORTED_LOCALES',$supported_locales);
	$smarty->assign('SETTINGS',$settings);
	$smarty->assign('SUPPORTED_THEMES', $supported_themes);
	$smarty->assign('SUPPORTED_CMENUTHEMES',array('default','xp','vista','osx','human','gloss'));
	$smarty->display('admin.tpl');
?>
