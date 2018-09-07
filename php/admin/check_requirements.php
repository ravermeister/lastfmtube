<?php
/**
 * User: ravermeister
 * Date: 06.09.2018
 * Time: 23:03
 */

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;
if (!isset ( $_GET ['check'] )) return;

$settings = Functions::getInstance()->getSettings();

$data ['req_php_version'] = version_compare ( phpversion (), '5.6.0' );
$data ['req_db_pdo'] = extension_loaded ( 'pdo_sqlite' ) || extension_loaded ( 'pdo_mysql' );

$data ['req_yt_api'] = strlen ( trim ( $settings ['youtube'] ['apikey'] ) ) > 0;
$data ['req_lfm_api'] = (strlen ( trim ( $settings ['lastfm'] ['apikey'] ) ) > 0) && (strlen ( trim ( $settings ['lastfm'] ['user'] ) ) > 0);
$data ['req_db_con'] = Db::getInstance ()->isConnected ();

die ( json_encode ( $data ) );
