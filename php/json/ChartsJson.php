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

    public function get($getvars) {
        $charts = Db::getInstance()->query('SELECT_CHARTS');
        return sizeof($charts) == 0 ? $this->jsonMsg('Keine daten vorhanden') : $this->jsonData($charts, 'chartlist');
    }

    public function put($getvars, $jsonvars) {
        if (!isset($jsonvars['track']) || strlen($jsonvars['track']) == 0) return $this->jsonError('Falsche parameter');

        Db::getInstance()->updateCharts($jsonvars['track']);
        return $this->jsonMsg('Track erfolgreich gespeichert');
    }
}