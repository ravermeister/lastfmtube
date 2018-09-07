<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 04:59
 */

namespace LastFmTube\json;


use LastFmTube\Util\Db;

class ChartsJson extends DefaultJson {

    public function __construct() {
        parent::__construct('charts');
    }

    public function getAll($getvars, $postvars) {
        $charts = Db::getInstance()->query('SELECT_CHARTS');
        return sizeof($charts) == 0 ? self::jsonMsg('Keine daten vorhanden') : self::jsonData($charts, 'chartlist');
    }

    public function put($getvars, $postvars) {
        if (!isset($postvars['track']) || strlen($postvars['track']) == 0) return self::jsonError('Falsche parameter');

        Db::getInstance()->updateCharts($postvars['track']);
        return self::jsonMsg('Track erfolgreich gespeichert');
    }
}