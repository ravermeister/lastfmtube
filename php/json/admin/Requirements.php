<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Json\Admin;

use LastFmTube\Json\DefaultJson;
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

class Requirements extends DefaultJson {

     public function __construct() {
          parent::__construct('requirements');
     }

     public function get($getvars) {
          $settings = Functions::getInstance()->getSettings();
          $data = array();
          $data['req_php_version'] = version_compare(phpversion(), '5.6.0');
          $data['req_db_pdo'] = extension_loaded('pdo_sqlite') || extension_loaded('pdo_mysql');

          $data['req_yt_api'] = strlen(trim($settings['youtube']['apikey'])) > 0;
          $data['req_lfm_api'] = (strlen(trim($settings['lastfm']['apikey'])) > 0) && (strlen(trim($settings['lastfm']['user'])) > 0);
          $data['req_db_con'] = Db::getInstance()->isConnected();

          return $this->jsonData($data, 'requirements_check');
     }

     public static function process($returnOutput = false) {}
}