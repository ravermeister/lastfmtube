<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 07:59
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Functions;

class LastFmJson extends DefaultJson {

    public function __construct() {
        parent::__construct('lastfm');
    }

    private function changeUser($newUser) {
        $data['user'] = $_SESSION['music']['lastfm_user'];


        /* lastfm user is not case sensitive */
        if (strcasecmp($newUser, $_SESSION ['music'] ['lastfm_user']) == 0) {
            $data['status'] = 'unchanged';
            return $this->jsonData($data);
        }

        $_SESSION ['music'] ['lastfm_user'] = $newUser;
        Functions::getInstance()->getLfmApi()->setUser($newUser);
        $data['user']   = $newUser;
        $data['status'] = 'changed';
        return $this->jsonData($data);
    }

    public function put($getvars, $jsonvars) {
        if (!isset($getvars['user']) || !isset($jsonvars['lastfm_user']) || strlen($jsonvars['lastfm_user']) == 0) {
            return $this->jsonError('unbekannte parameter für Update');
        }
        return $this->changeUser(trim($jsonvars['lastfm_user']));
    }
}