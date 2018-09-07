<?php
/**
 * User: ravermeister
 * Date: 06.09.2018
 * Time: 22:41
 */

require_once dirname(__FILE__) . '/../vendor/autoload.php';

use LastFmTube\Util\Db;
use \LastFmTube\Util\Functions;

$needle = strip_tags($_GET['track_needle']);
if(strlen($needle)==0) return;

$rows = Db::getInstance()->query('SEARCH_CHARTS_TRACK',$needle);
die(json_encode($rows));