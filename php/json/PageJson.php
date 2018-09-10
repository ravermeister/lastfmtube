<?php
/**
 * User: ravermeister
 * Date: 09.09.2018
 * Time: 23:31
 */

namespace LastFmTube\Json;

use LastFmTube\Json\DefaultJson;
use LastFmTube\Util\Functions;

class VuePageData {
    public $el;
    public $data;
}

class PageJson extends DefaultJson {
    private $settings;
    private $locale;

    public function __construct() {
        parent::__construct('page');
        $this->settings = Functions::getInstance()->getSettings();
        $this->locale = Functions::getInstance()->getLocale();
    }

    private function getPageData(){

        $data = new VuePageData();
        $data->el = 'head>title';
        $data->data['TITLE'] = $this->locale['site.title'];
        $page[] = $data;
        //title

        $data = new VuePageData();
        $data->el = 'header>nav';
        $data->data['MENUS'][] = array(
            'URL' => '#page-playlist',
            'NAME' => $this->locale['playlist.title'],
        );
        $data->data['MENUS'][] = array(
            'URL' => '#page-user',
            'NAME' => $this->locale['userplaylist.title'],
        );
        $data->data['MENUS'][] = array(
            'URL' => '#page-topuser',
            'NAME' => $this->locale['topuser.title'],
        );
        $data->data['MENUS'][] = array(
            'URL' => '#page-charts',
            'NAME' => $this->locale['charts.title'],
        );
        $page[] = $data;
        //nav

    

        return $this->jsonData($page, 'pagedata');
    }

    public function get($getvars) {

        if(!isset($getvars['data'])) $getvars['data'] = 'mainpage';

        switch (strtolower($getvars['data'])) {
            case 'pagedata':
                return $this->getPageData();
        }

        return $this->jsonError('Falsche Parameterangabe');
    }

}