<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:14
 */

namespace LastFmTube\Json;


interface JsonInterface {

    public function get($getvars, $postvars);
    public function getAll($getvars, $postvars);
    public function delete($getvars, $postvars);
    public function deleteAll($getvars, $postvars);
    public function put($getvars, $postvars);
    public function putAll($getvars, $postvars);
    public function update($getvars, $postvars);
    public function updateAll($getvars, $postvars);

}