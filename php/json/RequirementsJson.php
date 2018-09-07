<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 11:59
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

class RequirementsJson extends DefaultJson {

    public function __construct() {
        parent::__construct('requirements');
    }

    public function get($getvars) {
        $settings = Functions::getInstance()->getSettings();

        $data ['req_php_version'] = version_compare(phpversion(), '5.6.0');
        $data ['req_db_pdo']      = extension_loaded('pdo_sqlite') || extension_loaded('pdo_mysql');

        $data ['req_yt_api']  = strlen(trim($settings ['youtube'] ['apikey'])) > 0;
        $data ['req_lfm_api'] = (strlen(trim($settings ['lastfm'] ['apikey'])) > 0) &&
                                (strlen(trim($settings ['lastfm'] ['user'])) > 0);
        $data ['req_db_con']  = Db::getInstance()->isConnected();

        return $this->jsonData($data, 'requirements_check');
    }
}