<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 10:54
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

class EnvVarsJson extends DefaultJson {

    public function __construct() {
        parent::__construct('envvars');
    }

    public function get($getvars) {
        if (!isset ($getvars ['name'])) return;
        $key   = Functions::getInstance()->prepareNeedle($getvars['name']);
        $value = Db::getInstance()->getEnvVar($key);
        return $this->jsonData($this->createJSONData($key, $value));
    }

    private function createJSONData($name, $value = '') {
        $data['NAME']   = $name;
        $data['EXISTS'] = false;
        if (strlen($value) > 0) {
            $data['EXISTS'] = true;
            $data['VALUE']  = $value;
        }
        return $data;
    }

    public function put($getvars, $postvars) {
        return $this->post($getvars, $postvars);
    }

    public function post($getvars, $postvars) {
        if (!isset ($getvars ['action'])) $this->jsonError('ungültige Parameter');
        $action = filter_var($getvars['action'], FILTER_SANITIZE_STRING);
        switch ($action) {
            case 'savealternative':
                return $this->saveNeedle($postvars);
            case 'deletealternative':
                return $this->deleteNeedle($postvars);
                break;
            case 'savetrackchart':
                return $this->saveChartTrack($postvars);
                break;
            case 'saveuserchart':
                return $this->saveUserChart($postvars);
                break;
            default:
                $this->jsonError('unbekannte Action ' . $action);
        }
    }
    
    private function saveUserChart($postvars) {
        $username = filter_var($postvars['LASTFM_USER'], FILTER_SANITIZE_STRING);
        
        $data['username'] = $username;
        if(strlen(trim($username)) <= 0) {
            $data['playcount'] = -1;
            $data['lastplay'] = '';
            
            return $this->jsonData($data);
        }
        
        $updata = Db::getInstance()->updateLastFMUserVisit($username);
        $data['playcount'] = $updata['playcount'];
        $data['lastplay'] = $updata['last_played'];
            
        return $this->jsonData($data);
    }

    private function saveNeedle($postvars) {

        $artist = $postvars['artist'];
        $title  = $postvars['title'];
        $video  = $postvars['videoId'];

        $key   = Functions::getInstance()->prepareNeedle($artist . ' ' . $title);
        $value = html_entity_decode($video);

        Db::getInstance()->setEnvVar($key, $value);
        $value = Db::getInstance()->getEnvVar($key);
        return $this->jsonData($this->createJSONData($key, $value));
    }

    private function deleteNeedle($postvars) {
        $artist = $postvars['artist'];
        $title  = $postvars['title'];

        $key = Functions::getInstance()->prepareNeedle($artist . ' ' . $title);
        Db::getInstance()->delEnvVar($key);

        return $this->jsonData($this->createJSONData($key));
    }

    private function saveChartTrack($postvars) {
        $track{'artist'} = $postvars['artist'];
        $track['title']  = $postvars['title'];

        $data               = Db::getInstance()->updateCharts($track);
        $track['playcount'] = $data['playcount'];
        $track['lastplay']  = $data['lastplay_time'];

        return $this->jsonData($track);
    }

    public function delete($getvars) {
        if (!isset ($getvars ['name'])) return;
        $key = Functions::getInstance()->prepareNeedle($getvars['name']);

        $deleted = '0';
        $deleted = Db::getInstance()->delEnvVar($key);
        return $this->jsonData($this->createJSONData($key));
    }
}