<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';

use LastFmTube\Util\Db;

switch ($_POST ['action']) {
    case 'add' :
        $track = $_POST ['track'];
        Db::getInstance ()->updateCharts ( $track );
        break;

    case 'show' :
        $data = Db::getInstance ()->query ( 'SELECT_CHARTS' );
        echo json_encode ( $data );
        break;
}
