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

use LastFmTube\Json\DefaultJson;
use LastFmTube\Util\Db;
use Exception;

/**
 *
 * @author Jonny Rimkus<jonny@rimkus.it>
 *        
 */
class Playlist extends DefaultJson {

     public static function process($returnOutput = false) {
          $instance = new Playlist();
          $data = $instance->handleRequest();
          $data = $instance->jsonData($data);
          if ($returnOutput) return $data;
          die($data);
     }

     /**
      *
      * @return array|mixed|void
      */
     function get() {
          try {
               switch (self::getVar('list', '')) {
                    case 'playlist':
                         return $this->getLastFm(self::getVar('user', false), self::getVar('page', 1));
                    case 'topsongs':
                         return $this->getTopSongs(self::getVar('page', 1), self::getVar('sortby', false));
                    case 'topuser':
                         return $this->getTopUser(self::getVar('page', 1));
                    default:
                         $this->jsonError('invalid arguments');
                         break;
               }
          } catch (Exception $err) {
               $this->jsonError('error in get: ' . $err->getMessage());
          }
     }

     /**
      *
      * @param bool $user
      * @param int $pageNum
      * @return array
      * @throws Exception
      */
     private function getLastFm($user = false, $pageNum = 1) {
          $settings = $this->funcs->getSettings();
          $lfmapi = $this->funcs->getLfmApi();
          $locale = $this->funcs->getLocale();
          $db = Db::getInstance();
          die('slowly2');
          
          if ($this->isValidUser($user)) {
               if (strcmp($_SESSION['music']['lastfm_user'], $user) != 0) {
                    $_SESSION['music']['lastfm_user'] = $user;
                    $pageNum = 1;
               }
          } else if (! $this->isValidUser($_SESSION['music']['lastfm_user'])) {
               $_SESSION['music']['lastfm_user'] = $settings['general']['lastfm_defaultuser'];
               $user = $_SESSION['music']['lastfm_user'];
               $pageNum = 1;
          }

          $lfmapi->setUser($_SESSION['music']['lastfm_user']);
          if ($pageNum === false || $pageNum < 1) $pageNum = 1;

          $tracksPerpage = $settings['general']['tracks_perpage'];
          $playlist = $lfmapi->getRecentlyPlayed($pageNum, $tracksPerpage);
          $tracks = $playlist->getTracks();
          $pageStart = (($pageNum - 1) * $tracksPerpage);
          $maxpages = $playlist->getTotalPages() <= 0 ? 1 : $playlist->getTotalPages();
          $page = array(

               'HEADER' => array(
                    'TEXT' => $locale['playlist']['title'],
                    'URL' => '//last.fm/user/' . $lfmapi->getUser(),
                    'URL_TARGET' => '_blank',
                    'PLAYLIST' => 'playlist.lastfm'
               ),

               'LIST_MENU' => array(
                    'LASTFM_USER_NAME_LABEL' => $locale['playlist']['control']['user'],
                    'LASTFM_USER_NAME' => $lfmapi->getUser(),
                    'MAX_PAGES' => $maxpages,
                    'CUR_PAGE' => $pageNum,
                    'PLAYLIST' => 'playlist.lastfm'                    
               ),
               // lastfm navigation (pages/username)
          );

          $page['TRACKS'] = array();

          for ($cnt = 0; $cnt < sizeof($tracks); $cnt ++) {

               /** @var Track $track */
               $track = $tracks[$cnt];
               $track->normalize();

               $videoId = $db->query('GET_VIDEO', array(
                    'artist' => $track->getArtist(),
                    'title' => $track->getTitle()
               ));
               $videoId = is_array($videoId) && isset($videoId[0]['url']) ? $videoId[0]['url'] : '';

               $page['TRACKS'][] = array(
                    'NR' => ($pageStart + $cnt + 1),
                    'ARTIST' => $track->getArtist(),
                    'TITLE' => $track->getTitle(),
                    'LASTPLAY' => $track->isPlaying() ? $locale['playlist']['nowplaying'] : $this->funcs->formatDate($track->getDateofPlay()),
                    'LASTFM_ISPLAYING' => $track->isPlaying(),
                    'LASTFM_USER_NAME' => $lfmapi->getUser(),
                    'VIDEO_ID' => $videoId,
                    'PLAY_CONTROL' => false,
                    'PLAYLIST' => 'playlist.lastfm',
                    'PLAYSTATE' => ''
               );
          }
          // playlist content
          return $page;
     }

     private function isValidUser($user) {
          return (isset($user) && $user !== false && $user != null && strlen(filter_var($user, FILTER_SANITIZE_STRING)) > 0);
     }

     /**
      *
      * @param int $pageNum
      * @param bool $sortby
      * @return array
      * @throws Exception
      */
     private function getTopSongs($pageNum = 1, $sortby = false) {

          /**
           * TODO: the code below can be merged with Page.php#saveTrackPlay
           * find a good place where the common code can be shared
           */
          $db = Db::getInstance();
          $settings = $this->funcs->getSettings();
          $locale = $this->funcs->getLocale();
          $sort_bydate = $locale['playlist']['control']['sortby']['date'];
          $sort_bypcount = $locale['playlist']['control']['sortby']['playcount'];
          $limit = $settings['general']['tracks_perpage'];
          $offset = ($pageNum - 1) * $limit;

          if ($sortby === false || ! (strcmp($sortby, $sort_bydate) === 0 || strcmp($sortby, $sort_bypcount) === 0)) {
               $sortby = $locale['playlist']['control']['sortby']['playcount'];
          }

          $orderby = strcmp($sortby, $locale['playlist']['control']['sortby']['date']) === 0 ? 'lastplayed' : 'playcount';
          $orderbysecond = strcmp($sortby, $locale['playlist']['control']['sortby']['date']) === 0 ? 'playcount' : 'lastplayed';
          $topsongs = $db->query('SELECT_ORDERED_TRACKPLAY', array(
               'orderby' => $orderby,
               'orderbysecond' => $orderbysecond
          ));

          if (! is_array($topsongs)) {
               $topsongs = array();
          }

          $topsongs = $this->funcs->normalizePlaylist($topsongs, 'playlist.topsongs', $sortby);
          if (strcmp($sortby, $sort_bydate) === 0) {
               $this->funcs->sortTracksByDate($topsongs);
          } else {
               $this->funcs->sortTracksByPlayCount($topsongs);
          }
          $songcnt = sizeof($topsongs);
          $maxpages = ((int) ($songcnt / $limit));
          if (($songcnt % $limit) > 0 || $maxpages <= 0) $maxpages ++;

          $page = array(

               'HEADER' => array(
                    'TEXT' => $locale['menu']['topsongs'],
                    'URL' => '#playlist-container',
                    'URL_TARGET' => '_self',
                    'PLAYLIST' => 'playlist.topsongs'
               ),

               'LIST_MENU' => array(
                    'MAX_PAGES' => $maxpages,
                    'CUR_PAGE' => $pageNum,
                    'PLAYLIST' => 'playlist.topsongs',
                    'SORTBY' => array(
                         'LABEL' => $locale['playlist']['control']['sortby']['label'],
                         'SELECTED' => $sortby,
                         'VALUES' => array(
                              $locale['playlist']['control']['sortby']['date'],
                              $locale['playlist']['control']['sortby']['playcount']
                         )
                    )
               ),
               // lastfm navigation (pages/username)
          );

          $page['TRACKS'] = array();
          if ($topsongs === 0 || ! is_array($topsongs)) return $page;

          $page['TRACKS'] = array_slice($topsongs, $offset, $limit);
          return $page;
     }

     /**
      *
      * @param int $pageNum
      * @param bool $user
      * @return array
      * @throws Exception
      */
     private function getTopUser($pageNum = 1, $user = false) {
          if ($user !== false) {
               if (strcmp($_SESSION['music']['lastfm_user'], $user) != 0) {
                    $_SESSION['music']['lastfm_user'] = $user;
                    $pageNum = 1;
               }
          }

          $settings = $this->funcs->getSettings();
          $db = Db::getInstance();
          $locale = $this->funcs->getLocale();
          $limit = $settings['general']['tracks_perpage'];
          $offset = ($pageNum - 1) * $limit;

          $topuser = $db->query('SELECT_ALL_LASTFM_USER', array(
               'limit' => $limit,
               'offset' => $offset
          ));
          $maxpages = $db->query('SELECT_ALL_LASTFM_USER_NUM_ROWS');
          $maxpages = $maxpages === false ? 1 : $maxpages['cnt'];
          $maxpages = ((int) ($maxpages / $limit));

          if (($maxpages % $limit) > 0 || $maxpages <= 0) $maxpages ++;

          $page = array(

               'HEADER' => array(
                    'TEXT' => $locale['menu']['topuser'],
                    'URL_TARGET' => '_self',
                    'TYPE' => 'topuser'
               ),

               'LIST_MENU' => array(
                    'MAX_PAGES' => $maxpages,
                    'CUR_PAGE' => $pageNum
               ),
               // lastfm navigation (pages/username)
          );

          $page['USER'] = array();
          if ($topuser === 0 || ! is_array($topuser)) return $page;
          for ($cnt = 0; $cnt < sizeof($topuser); $cnt ++) {
               $user = $topuser[$cnt];

               $page['USER'][] = array(
                    'NR' => ($offset + $cnt + 1),
                    'NAME' => $user['lfmuser'],
                    'LASTPLAY' => $this->funcs->formatDate($user['lastplayed']),
                    'PLAYCOUNT' => $user['playcount'],
                    'PLAY_CONTROL' => ''
               );
          }

          return $page;
     }
}

Playlist::process();
