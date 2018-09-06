<?php

namespace LastFmTube\Util;

$basedir = dirname(__FILE__).'/../..';
require_once $basedir.'/vendor/autoload.php';

use Exception;
use Smarty;
use LastFmTube\Util\lfmapi\LastFm;
use LastFmTube\Util\ytapi\YoutubeSearch;


$file = $basedir.'/conf/settings.ini';
if (! $settings = parse_ini_file ( $file, TRUE ))
    throw new Exception ( 'Unable to open ' . $file . '.' );
if (strncmp ( $settings ['general'] ['baseurl'], '/', strlen ( $settings ['general'] ['baseurl'] ) ) === 0) {
    $settings ['general'] ['baseurl'] = substr ( $settings ['general'] ['baseurl'], 1 );
}

$smarty = new Smarty ();
$smarty->setTemplateDir ( $basedir.'/themes/' . $settings ['general'] ['theme'] );
$smarty->setCacheDir ( $basedir.'/tmp/smarty/cache' );
$smarty->setCompileDir ( $basedir.'/tmp/smarty/compile' );
$smarty->caching = false;

Functions::getInstance ()->startSession ();

if (isset ( $_GET ['lastfm_user'] )) {
    $_SESSION ['music'] ['lastfm_user'] = $_GET ['lastfm_user'];
    unset ( $_GET ['lastfm_user'] );
} else if (! isset ( $_SESSION ['music'] ['lastfm_user'] )) {
    $_SESSION ['music'] ['lastfm_user'] = $settings ['general'] ['lastfm_defaultuser'];
}
$_SESSION ['music'] ['lastfm_user'] = trim ( $_SESSION ['music'] ['lastfm_user'] );


$lastfm = new LastFm ();
$lastfm->setApiKey ( $settings ['lastfm'] ['apikey'] );
$lastfm->setUser ( $_SESSION ['music'] ['lastfm_user'] );


$searcher = new YoutubeSearch ();
if (isset ( $settings ['youtube'] ['email'] ))
    $searcher->setAPIEmail ( $settings ['youtube'] ['email'] );
if (isset ( $settings ['youtube'] ['jsonfile'] ))
    $searcher->setAPIJson ( $settings ['youtube'] ['jsonfile'] );
if (isset ( $settings ['youtube'] ['user'] ))
    $searcher->setAPIUser ( $settings ['youtube'] ['user'] );
$searcher->setAPIKey ( $settings ['youtube'] ['apikey'] );

$smarty->assign ( 'BASE_PATH', $settings ['general'] ['baseurl'] );
$smarty->assign ( 'LOCALE', $settings ['general'] ['lang'] );
$smarty->assign ( 'LANG', Functions::getInstance ()->loadLangFile () );
$smarty->assign ( 'ytplayerwidth', $settings ['general'] ['playerwidth'] );
$smarty->assign ( 'ytplayerheight', $settings ['general'] ['playerheight'] );
$smarty->assign ( 'cmenutheme', $settings ['general'] ['cmenutheme'] );
