<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 10:54
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Db;

class EnvVarsJson extends DefaultJson {

    public function __construct() {
        parent::__construct('envvars');
    }


    public function get($getvars) {
        if (!isset ($getvars ['name'])) return;
        $key = Functions::getInstance()->prepareNeedle($getvars['name']);

        return $this->jsonData(Db::getInstance()->getEnvVar($key));
    }

    public function post($getvars, $postvars) {
        if (!isset ($getvars ['name'])) return;
        $key   = Functions::getInstance()->prepareNeedle($getvars['name']);
        $value = html_entity_decode($getvars['value']);

        Db::getInstance()->setEnvVar($key, $value);
        $value = Db::getInstance()->getEnvVar($key);
        return $this->jsonData($value);
    }

    public function delete($getvars) {
        if (!isset ($getvars ['name'])) return;
        $key = Functions::getInstance()->prepareNeedle($getvars['name']);

        $deleted = '0';
        $deleted = Db::getInstance()->delEnvVar($key);
        return $this->jsonData($deleted);
    }
}