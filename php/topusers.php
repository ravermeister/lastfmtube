<?php

use LastFmTube\Util\Db;

require_once dirname(__FILE__) . '/../vendor/autoload.php';

if (! isset ( $_POST ['action'] ))
    return;

switch ($_POST ['action']) {
    case 'show' :
    case 'list' :
        $data = Db::getInstance ()->query ( 'SELECT_ALL_LASTFM_USER' );
        echo json_encode ( $data );
        break;
}
