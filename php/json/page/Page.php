<?php
/**
 * User: ravermeister
 * Date: 09.09.2018
 * Time: 23:31
 */

namespace LastFmTube\Json\Page;
require_once dirname(__FILE__) . '/../DefaultJson.php';

use LastFmTube\Json\DefaultJson;

class Page extends DefaultJson {
    
    public function get() {
        switch (self::getVar('action', '')) {
            case 'init':
                return array(
                    'content'  => $this->getBase(),
                    'basemenu' => $this->getBaseMenu(),
                    'listmenu' => $this->getListMenu()
                );
        }
    }


    private function getBase() {

        return array(
            'TITLE' => $this->funcs->getLocale()['site.title'],
            'TEXT'  => $this->funcs->getLocale()['site.header.text'],
            'MENU'  => $this->getBaseMenu()
        );
        //header content
    }

    private function getBaseMenu() {

        $menu       = $this->getListMenu();
        $basemenu   = array();
        $basemenu[] = $menu['YTPLAYER'];
        $basemenu[] = $menu['LASTFM'];
        $basemenu[] = $menu['USERLIST'];
        $basemenu[] = $menu['TOPSONGS'];
        $basemenu[] = $menu['TOPUSER'];

        return $basemenu;
    }

    private function getListMenu() {

        $locale = $this->funcs->getLocale();
        return array(
            'TOPUSER'  => array(
                'TEXT' => $locale['menu.topuser'],
                'PAGE' => 'user-container',
                'LDATA' => 'topuser'
            ),
            'TOPSONGS' => array(
                'TEXT'     => $locale['menu.topsongs'],
                'PAGE'     => 'playlist-container',
                'LDATA' => 'topsongs',
            ),
            'LASTFM'   => array(
                'TEXT'     => $locale['menu.lastfm'],
                'PAGE'     => 'playlist-container',
                'LDATA' => 'lastfm',
            ),
            'SEARCH'   => array(
                'TEXT'     => $locale['menu.search'],
                'PAGE'     => 'playlist-container',
                'LDATA' => 'search',
            ),
            'USERLIST' => array(
                'TEXT'     => $locale['menu.userlist'],
                'PAGE'     => 'playlist-container',
                'LDATA' => 'userlist',
            ),
            'YTPLAYER' => array(
                'TEXT' => $locale['menu.youtube'],
                'PAGE' => 'video-container',
                'LDATA' => 'video'
            )
        );
    }
    
    public static function process($returnOutput = false) {
        $instance = new Page();
        $data = $instance->handleRequest();
        $data = $instance->jsonData($data);
        if ($returnOutput) return $data;
        die($data);
    }
}

Page::process();