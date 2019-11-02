<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Json\Page;

require_once dirname(__FILE__) . '/../DefaultJson.php';

use Exception;
use LastFmTube\Json\DefaultJson;
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

class Page extends DefaultJson {

     public static function process($returnOutput = false) {
          /** @var Page $instance */
          $instance = new Page();
          $data = $instance->handleRequest();
          $data = $instance->jsonData($data);
          if ($returnOutput) return $data;
          die($data);
     }

    /**
     * @return array|mixed|void
     */
     public function get() {
          switch (self::getVar('action', '')) {
               case 'init':
                    return array(
                         'content' => $this->getBase(),
                         'basemenu' => $this->getBaseMenu(),
                         'listmenu' => $this->getListMenu()
                    );
               case 'config':
                    return $this->getWebConfig();
               default:
                    $this->jsonError('invalid arguments');
                    break;
          }
     }

     private function getWebConfig() {
          $webconfig = array();
          $settings = Functions::getInstance()->getSettings();

          $webconfig['general']['lang'] = $settings['general']['lang'];
          $webconfig['general']['tracksPerPage'] = $settings['general']['tracks_perpage'];
          $webconfig['general']['errorVideo'] = $settings['general']['error_video'];
          $webconfig['general']['playerHeight'] = $settings['general']['playerheight'];
          $webconfig['general']['playerWidth'] = $settings['general']['playerwidth'];

          return $webconfig;
     }

     private function getBase() {
          return array(
               'TITLE' => $this->funcs->getLocale()['site']['title'],
               'TEXT' => $this->funcs->getLocale()['site']['header'],
               'MENU' => $this->getBaseMenu()
          );
          // header content
     }

     private function getBaseMenu() {
          $menu = $this->getListMenu();
          $basemenu = array();
          $basemenu[] = $menu['YTPLAYER'];
          $basemenu[] = $menu['LASTFM'];
          $basemenu[] = $menu['USERLIST'];
          $basemenu[] = $menu['TOPSONGS'];
          $basemenu[] = $menu['TOPUSER'];
          $basemenu[] = $menu['LIVE'];

          return $basemenu;
     }

     private function getListMenu() {
          $locale = $this->funcs->getLocale();
          return array(
               'TOPUSER' => array(
                    'TEXT' => $locale['menu']['topuser'],
                    'PAGE' => 'user-container',
                    'LDATA' => 'topuser'
               ),
               'TOPSONGS' => array(
                    'TEXT' => $locale['menu']['topsongs'],
                    'PAGE' => 'playlist-container',
                    'LDATA' => 'topsongs'
               ),
               'LASTFM' => array(
                    'TEXT' => $locale['menu']['lastfm'],
                    'PAGE' => 'playlist-container',
                    'LDATA' => 'lastfm'
               ),
               'SEARCH' => array(
                    'TEXT' => $locale['menu']['search'],
                    'PAGE' => 'playlist-container',
                    'LDATA' => 'search'
               ),
               'USERLIST' => array(
                    'TEXT' => $locale['menu']['userlist'],
                    'PAGE' => 'playlist-container',
                    'LDATA' => 'userlist'
               ),
               'YTPLAYER' => array(
                    'TEXT' => $locale['menu']['youtube'],
                    'PAGE' => 'video-container',
                    'LDATA' => 'video'
               ),
               'LIVE' => array(
                    'TEXT' => $locale['menu']['live'],
                    'PAGE' => 'playlist-container',
                    'LDATA' => 'topsongs'
               )
          );
     }

    /**
     * @return array|int|mixed|void
     * @throws Exception
     */
     public function post() {
          switch (self::getVar('action', '')) {
               case 'save-trackplay':
                    return $this->saveTrackPlay();
               case 'save-userplay':
                    return $this->saveUserPlay();
                    break;
              default:
                  $this->jsonError('invalid arguments');
                  break;
          }
     }

     /**
      *
      * @throws Exception
      */
     private function saveTrackPlay() {
          $artist = trim($this->funcs->decodeHTML(self::getVar('artist', '', $_POST)));
          $title = trim($this->funcs->decodeHTML(self::getVar('title', '', $_POST)));
          if (strlen(trim($artist)) === 0 && strlen(trim($title)) === 0) {
               $this->jsonError('can not save trackplay, insufficient data');
          }

          $data = Db::getInstance()->updateTrackPlay($artist, $title);

          return $data;
     }

     /**
      *
      * @return array
      * @throws Exception
      */
     private function saveUserPlay() {
          $user = self::getVar('user', '', $_POST);
          if (trim(strlen($user)) === 0) {
               $this->jsonError('can not save userplay, insufficient data');
          }

          return Db::getInstance()->updateLastFMUserVisit($user);
     }
}

Page::process();