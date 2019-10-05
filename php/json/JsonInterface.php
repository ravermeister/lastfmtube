<?php

/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:14
 */
namespace LastFmTube\Json;

interface JsonInterface {

     public function get();

     public function delete();

     public function post();

     public function put();
}