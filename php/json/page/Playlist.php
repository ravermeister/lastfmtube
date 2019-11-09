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
use LastFmTube\Util\Functions;
use DateTime;
use Exception;

class Playlist extends DefaultJson {

     public static function process($returnOutput = false) {
          $instance = new Playlist();
          $data = $instance->handleRequest();
          $data = $instance->jsonData($data);
          if ($returnOutput) return $data;
          die($data);
     }

    /**
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
             $this->jsonError('error in get: '.$err->getMessage());
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
                    'PLAYLIST' => 'lastfm'
               ),

               'LIST_MENU' => array(
                    'LASTFM_USER_NAME_LABEL' => $locale['playlist']['control']['user'],
                    'LASTFM_USER_NAME' => $lfmapi->getUser(),
                    'CUR_PAGE_LABEL' => $locale['playlist']['control']['page'],
                    'PAGES_OF_LABEL' => $locale['playlist']['control']['pageof'],
                    'MAX_PAGES' => $maxpages,
                    'CUR_PAGE' => $pageNum,
                    'PLAYLIST_LOAD' => $locale['playlist']['control']['load'],
                    'playlist' => 'lastfm'
               ),
               // lastfm navigation (pages/username)

               'LIST_HEADER' => array(
                    'TRACK_NR' => $locale['playlist']['header']['nr'],
                    'TRACK_ARTIST' => $locale['playlist']['header']['artist'],
                    'TRACK_TITLE' => $locale['playlist']['header']['title'],
                    'TRACK_LASTPLAY' => $locale['playlist']['header']['lastplay']
               )
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
     * @param int $pageNum
     * @param bool $sortby
     * @return array
     * @throws Exception
     */
     private function getTopSongs($pageNum = 1, $sortby = false) {
          $settings = $this->funcs->getSettings();
          $locale = $this->funcs->getLocale();
          $sort_bydate = $locale['playlist']['control']['sortby']['date'];
          $sort_bypcount = $locale['playlist']['control']['sortby']['playcount'];

          if ($sortby === false || ! (strcmp($sortby, $sort_bydate) == 0 || strcmp($sortby, $sort_bypcount) == 0)) {
               $sortby = $locale['playlist']['control']['sortby']['playcount'];
          }

          $db = Db::getInstance();
          $limit = $settings['general']['tracks_perpage'];
          $offset = ($pageNum - 1) * $limit;
          $trackCnt = $db->query('SELECT_TRACKPLAY_NUM_ROWS');
          $trackCnt = (int) ($trackCnt === false ? 1 : $trackCnt['cnt']);

          $orderby = strcmp($sortby, $locale['playlist']['control']['sortby']['date']) === 0 ? 'lastplayed' : 'playcount';
          $orderbysecond = strcmp($sortby, $locale['playlist']['control']['sortby']['date']) === 0 ? 'playcount' : 'lastplayed';

          $topsongs = $db->query('SELECT_TRACKPLAY', array(
               /**
                *
                * @fixme: the multiplier 4 is used for checking
                * duplicates after the track artist and title string normalization.
                * We should have a better and performant way
                * to calculate the track rank after the duplicates were merged together.
                *
                * I set the limit to the rowcount of the tracks sothat we search
                * the complete play history of all tracks!!!
                * add the commented limit if performance is worse!
                */
               /* 'limit' => $limit * 3, */
               'limit' => $trackCnt,
               'orderby' => $orderby,
               'orderbysecond' => $orderbysecond,

               /**
                * we need offset 0, becaus we calculate
                * the finaly result of songs (merging duplicates)
                * and recalculate the total page count
                */
               'offset' => 0
          ));

         if (! is_array($topsongs)) {
               $topsongs = array();
          }

          $uniqueTracks = array();
          for ($cnt = 0; $cnt < sizeof($topsongs); $cnt ++) {
               $track = $topsongs[$cnt];
               $normalizedArtist = &$track['artist'];
               $normalizedTitle = &$track['title'];

               // Functions::getInstance()->logMessage('before topsonsgs normalize, artist: >' . $track['artist'] . '<, title: >' . $track['title'] . '<');
               Functions::normalizeTrack($normalizedArtist, $normalizedTitle);
               // $track['artist'] = $normalizedArtist;
               // $track['title'] = $normalizedTitle;
               // Functions::getInstance()->logMessage('after topsonsgs normalize, artist: >' . $track['artist'] . '<, title: >' . $track['title'] . '<');
               // Functions::getInstance()->logMessage('after topsonsgs normalize, artist: >' . $track['artist'] . '<, title: >' . $track['title'] . '<');

               $trackId = $track['artist'] . '-' . $track['title'];
               if (array_key_exists($trackId, $uniqueTracks)) {
                    $uniqueTrack = $uniqueTracks[$trackId];
                    $uniqueTrack['PLAYCOUNT'] = ((int) $uniqueTrack['PLAYCOUNT']) + ((int) $track['playcount']);

                    $date1 = new DateTime($uniqueTrack['LASTPLAY']);
                    $date2 = new DateTime($this->funcs->formatDate($track['lastplayed']));
                    if ($date2 > $date1) {
                         $uniqueTrack['LASTPLAY'] = $track['lastplayed'];
                    }

                    $uniqueTracks[$trackId] = $uniqueTrack;
                    continue;
               }

               $videoId = $db->query('GET_VIDEO', array(
                    'artist' => $track['artist'],
                    'title' => $track['title']
               ));
               $videoId = is_array($videoId) && isset($videoId[0]['url']) ? $videoId[0]['url'] : '';

               $pTrack = array(
                    'NR' => ($offset + $cnt + 1),
                    'ARTIST' => $track['artist'],
                    'TITLE' => $track['title'],
                    'LASTPLAY' => $this->funcs->formatDate($track['lastplayed']),
                    'LASTFM_ISPLAYING' => false,
                    'PLAYCOUNT' => $track['playcount'],
                    'VIDEO_ID' => $videoId,
                    'PLAY_CONTROL' => false,
                    'PLAYLIST' => 'playlist.topsongs',
                    'PLAYSTATE' => ''
               );
               $uniqueTracks[$trackId] = $pTrack;
          }
          $uniqueTracks = array_values($uniqueTracks);
          if (strcmp($sortby, $sort_bydate) == 0) {
               $this->funcs->sortTracksByDate($uniqueTracks, $offset);
          } else {
               $this->funcs->sortTracksByPlayCount($uniqueTracks, $offset);
          }

          $maxpages = ((int) (sizeof($uniqueTracks) / $limit));
          if (($maxpages % $limit) > 0 || $maxpages <= 0) $maxpages ++;

          $page = array(

               'HEADER' => array(
                    'TEXT' => $locale['menu']['topsongs'],
                    'URL' => '#playlist-container',
                    'URL_TARGET' => '_self',
                    'PLAYLIST' => 'topsongs'
               ),

               'LIST_MENU' => array(
                    'MAX_PAGES' => $maxpages,
                    'CUR_PAGE' => $pageNum,
                    'playlist' => 'topsongs',
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

               'LIST_HEADER' => array(
                    'TRACK_NR' => $locale['playlist']['header']['nr'],
                    'TRACK_ARTIST' => $locale['playlist']['header']['artist'],
                    'TRACK_TITLE' => $locale['playlist']['header']['title'],
                    'TRACK_LASTPLAY' => $locale['playlist']['header']['lastplay'],
                    'TRACK_PLAYCOUNT' => $locale['playlist']['header']['playcount']
               )
          );

          $page['TRACKS'] = array();
          if ($topsongs === 0 || ! is_array($topsongs)) return $page;

          $page['TRACKS'] = array_slice($uniqueTracks, $offset, $limit);
          return $page;
     }

    /**
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

               'LIST_HEADER' => array(
                    'USER_NR' => $locale['playlist']['header']['nr'],
                    'USER_NAME' => $locale['playlist']['header']['name'],
                    'USER_LASTPLAY' => $locale['playlist']['header']['lastplay'],
                    'USER_PLAYCOUNT' => $locale['playlist']['header']['playcount']
               )
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
