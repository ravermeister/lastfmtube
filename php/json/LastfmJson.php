<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 07:59
 */

namespace LastFmTube\Json;


class LastfmJson extends DefaultJson {


    public function update($getvars, $postvars) {
        $getvars = $data['getvars'];
        $postvars = $data['postvars'];
        if(isset($data['user'])) {

        }

        return $this->jsonError('unbekannte parameter für Update');
    }
}