<?php
        require_once dirname(__FILE__).'/smarty/libs/Smarty.class.php';
	require_once dirname(__FILE__).'/db.class.php';
        require_once dirname(__FILE__).'/functions.php';
        require_once dirname(__FILE__).'/lastfm_api.php';
	require_once dirname(__FILE__).'/youtube_search.php';

	$file = dirname(__FILE__).'/../conf/settings.ini';
	if (!$settings = parse_ini_file($file, TRUE)) throw new exception('Unable to open ' . $file . '.');
	if (strncmp($settings['general']['baseurl'], '/', strlen($settings['general']['baseurl'])) === 0) {
		$settings['general']['baseurl'] = substr($settings['general']['baseurl'], 1);
	}

	$smarty = new Smarty();
	$smarty->setTemplateDir(dirname(__FILE__).'/../themes/'.$settings['general']['theme']);
	$smarty->setCacheDir(dirname(__FILE__).'/../tmp/smarty/cache');
	$smarty->setCompileDir(dirname(__FILE__).'/../tmp/smarty/compile');
	$smarty->caching = false;
	
	Functions::getInstance()->startSession();

	if(isset($_GET['lastfm_user'])) {
	    $_SESSION['music']['lastfm_user'] = $_GET['lastfm_user'];
	    unset($_GET['lastfm_user']);
	} else if(!isset($_SESSION['music']['lastfm_user'])) {
	    $_SESSION['music']['lastfm_user'] = $settings['general']['lastfm_defaultuser'];
	}
	$_SESSION['music']['lastfm_user'] = trim($_SESSION['music']['lastfm_user']);

	$lastfm = new lastfm();
	$lastfm->setApiKey($settings['lastfm']['apikey']);
	$lastfm->setUser($_SESSION['music']['lastfm_user']);
	
	$searcher = new youtubeSearch();	
	if(isset($settings['youtube']['email'])) $searcher->setAPIEmail($settings['youtube']['email']);
	if(isset($settings['youtube']['keyfile'])) $searcher->setAPIPK12($settings['youtube']['keyfile']);
        if(isset($settings['youtube']['user'])) $searcher->setAPIUser($settings['youtube']['user']);
        $searcher->setAPIKey($settings['youtube']['apikey']);
	
	
	$smarty->assign('BASE_PATH',$settings['general']['baseurl']);
	$smarty->assign('LOCALE', $settings['general']['lang']);
	$smarty->assign('LANG', Functions::getInstance()->loadLangFile());
	$smarty->assign('ytplayerwidth',$settings['general']['playerwidth']);
	$smarty->assign('ytplayerheight',$settings['general']['playerheight']);
	$smarty->assign('cmenutheme',$settings['general']['cmenutheme']);
?>
