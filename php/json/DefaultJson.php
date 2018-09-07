<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:18
 */

namespace LastFmTube\Json;


abstract class DefaultJson implements JsonInterface {

    public function get($getvars, $postvars) {}
    public function getAll($getvars, $postvars) {}
    public function delete($getvars, $postvars) {}
    public function deleteAll($getvars, $postvars) {}
    public function update($getvars, $postvars) {}
    public function updateAll($getvars, $postvars) {}
    public function put($getvars, $postvars) {}
    public function putAll($getvars, $postvars) {}

    private $apiName;
    private $currentMethod = 'unknown';

    protected function __construct($api) {
        $this->apiName=$api;
    }

    public final function setMethod($method='unknown') {
        $this->currentMethod = $method;
    }

    public static function baseError($msg) {
        $json['handler'] = 'default';
        $json['method'] = 'unknown';
        $json['data']['type'] = 'error';
        $json['data']['value'] = $msg;
        die(json_encode($json));
    }

    public function jsonError($msg) {
        $json['handler'] = $this->apiName;
        $json['method'] = $this->currentMethod;
        $json['data']['type'] = 'error';
        $json['data']['value'] = $msg;
        return json_encode($json);
    }

    public static function baseMsg($msg) {
        $json['handler'] = 'default';
        $json['method'] = 'unknown';
        $json['data']['type'] = 'msg';
        $json['data']['value'] = $msg;
        return json_encode($json);
    }

    public function jsonMsg($msg) {
        $json['handler'] = $this->apiName;
        $json['method'] = $this->currentMethod;
        $json['data']['type'] = 'msg';
        $json['data']['value'] = $msg;
        return json_encode($json);
    }

    public function jsonData($data, $dataType='data') {
        $json['handler'] = $this->apiName;
        $json['method'] = $this->currentMethod;
        $json['data']['type'] = $dataType;
        $json['data']['value'] = $data;
        return json_encode($json);
    }
}