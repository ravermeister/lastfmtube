<?php
/**
 * User: ravermeister
 * Date: 10.09.2018
 * Time: 01:19
 */

require_once 'vendor/autoload.php';
use LastFmTube\Util\Functions;

$settings = Functions::getInstance()->getSettings();

$themeFile = $settings['general']['theme'];
$baseURL   = $settings['general']['baseurl'];

$themeData = file_get_contents('themes/'.$themeFile.'/'.$themeFile.'.html');
$themeData = str_replace('{{LANG}}', $settings['general']['lang'], $themeData);

die($themeData);