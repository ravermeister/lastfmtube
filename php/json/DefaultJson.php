<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:18
 */

namespace LastFmTube\Json;


abstract class DefaultJson implements JsonInterface {

    private $apiName;
    private $currentMethod = 'unknown';

    protected function __construct($api) {
        $this->apiName = $api;
    }

    public static function baseError($msg) {
        $json['handler']       = 'default';
        $json['method']        = 'unknown';
        $json['data']['type']  = 'error';
        $json['data']['value'] = $msg;

        die('handler: default, method: unknown, error: ' . $msg);
        //die(json_encode($json));
    }

    public static function baseMsg($msg) {
        $json['handler']       = 'default';
        $json['method']        = 'unknown';
        $json['data']['type']  = 'msg';
        $json['data']['value'] = $msg;
        return json_encode($json);
    }

    public function get($getvars) {
    }

    public function delete($getvars) {
    }

    public function post($getvars, $postvars) {
    }

    public function put($getvars, $jsonvars) {
    }

    public final function setMethod($method = 'unknown') {
        $this->currentMethod = $method;
    }

    public function jsonError($msg) {
        $json['handler']       = $this->apiName;
        $json['method']        = $this->currentMethod;
        $json['data']['type']  = 'error';
        $json['data']['value'] = $msg;
        return die(('handler: ' . $this->apiName . ', method: ' . $this->currentMethod . ', error: ' . $msg));
        //return json_encode($json);
    }

    public function jsonMsg($msg) {
        $json['handler']       = $this->apiName;
        $json['method']        = $this->currentMethod;
        $json['data']['type']  = 'msg';
        $json['data']['value'] = $msg;
        return json_encode($json);
    }

    public function jsonData($data, $dataType = 'data') {
        $json['handler']       = $this->apiName;
        $json['method']        = $this->currentMethod;
        $json['data']['type']  = $dataType;
        $json['data']['value'] = $data;
        return json_encode($json);
    }
}