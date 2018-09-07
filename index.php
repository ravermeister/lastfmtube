<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 12:13
 */

require_once 'vendor/autoload.php';

use LastFmTube\Util\Functions;

$functions = Functions::getInstance();
$functions->startSession();
$settings = $functions->getSettings();
$smarty   = $functions->getSmarty();

$active_chartcounter = !isset($_GET['disable_charts']);


$smarty->assign('charts_counter', $active_chartcounter);
$smarty->assign('autostart', true);
$smarty->assign('music', 1);
$smarty->assign('lastfm_user', $_SESSION['music']['lastfm_user']);

$smarty->assign('current_page', 1);
$smarty->assign('total_pages', 10);

$smarty->display('index.tpl');