<?php
/**
 * User: ravermeister
 * Date: 10.09.2018
 * Time: 01:19
 */
require_once 'vendor/autoload.php';

use LastFmTube\Util\Functions;

$settings = Functions::getInstance ()->getSettings ();
$locale = Functions::getInstance ()->getLocale ();
$themeFile = $settings ['general'] ['theme'];
$baseURL = $settings ['general'] ['baseurl'];

$themeData = file_get_contents ( 'themes/' . $themeFile . '/' . $themeFile . '.html' );
$themeData = str_replace ( '{{PHP_LANG}}', $locale ['code'], $themeData );
$themeData = str_replace ( '{{PHP_TITLE}}', $locale ['site'] ['title'], $themeData );

// header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
// header("Pragma: no-cache"); // HTTP 1.0.
// header("Expires: 0"); // Proxies.

header ( "Content-Type: text/html" ); // html content

Functions::getInstance ()->startSession ();
// we need postgres or sqlite 3.25.2 (Window function --> RANK())
// Functions::getInstance()->logMessage('SQLite Version: '.\LastFmTube\Util\Db::getVersion());

die ( $themeData );