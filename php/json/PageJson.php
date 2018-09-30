<?php
/**
 * User: ravermeister
 * Date: 09.09.2018
 * Time: 23:31
 */

namespace LastFmTube\Json;

use Exception;
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;
use LastFmTube\Util\lfmapi\Track;

class PageJson extends DefaultJson {

    private $settings;
    private $locale;
    private $lfmapi;
    private $funcs;

    public function __construct($api = 'page') {
        parent::__construct($api);

        $funcs = Functions::getInstance();
        $funcs->startSession();

        $this->funcs    = $funcs;
        $this->settings = $funcs->getSettings();
        $this->locale   = $funcs->getLocale();
        $this->lfmapi   = $funcs->getLfmApi();
        $this->db       = DB::getInstance();
    }

    public function get($getvars) {
        try {
            $data     = null;
            $type     = null;
            $parmData = isset($getvars['data']) ? strtolower($getvars['data']) : strtolower($this->apiName);

            switch ($parmData) {
                case 'page':
                    $data = $this->getPage();
                    $type = 'pagedata';
                    break;
                case 'playlist':
                    $user     = isset($getvars['user']) ? $getvars['user'] : null;
                    $page     = isset($getvars['page']) ? $getvars['page'] : null;
                    $playlist = isset($getvars['type']) ? $getvars['type'] : $this->apiName;
                    switch ($playlist) {
                        case 'topsongs':
                            $data = $this->getTopSongs($page);
                            break;
                        case 'topuser':
                            $data = $this->getTopUser($page);
                            break;
                        case 'default:':
                        default:
                            $data = $this->getPlaylist($user, $page);
                            break;
                    }
                    $type = $playlist;
                    break;
                case 'playlist-menu':
                    $data = $this->getPlaylistMenu();
                    $type = 'playlist-menu';
                    break;
                default:
                    return $this->jsonError('Falsche parameter Angabe');
            }
            return $this->jsonData($data, $type);
        } catch (Exception $err) {
            return $this->jsonError('unbekannter Fehler: ' . $err->getMessage());
        }


    }

    /**
     * @return false|string
     */
    private function getPage() {

        $page['base']     = $this->getBase();
        $page['youtube']  = $this->getYoutube();
        $page['playlist'] = $this->getPlaylist();
        $page['userlist'] = $this->getTopUser();
        return $page;
    }

    private function getBase() {

        return array(
            'TITLE' => $this->locale['site.title'],
            'TEXT'  => $this->locale['site.header.text'],
            'MENU'  => $this->getBaseMenu()
        );
        //header content

    }

    private function getBaseMenu() {
        $menu       = $this->getPlaylistMenu();
        $basemenu   = array();
        $basemenu[] = $menu['YTPLAYER'];
        $basemenu[] = $menu['LASTFM'];
        $basemenu[] = $menu['USERLIST'];
        $basemenu[] = $menu['TOPSONGS'];
        $basemenu[] = $menu['TOPUSER'];
        //foreach($menu as $key => $value) {
        //    $basemenu[] = $menu[$key];
        //}
        return $basemenu;
    }

    private function getPlaylistMenu() {
        return array(
            'TOPUSER'  => array(
                'TEXT' => $this->locale['menu.topuser'],
                'PAGE' => 'user-container'
            ),
            'TOPSONGS' => array(
                'TEXT'     => $this->locale['menu.topsongs'],
                'PAGE'     => 'playlist-container',
                'PLAYLIST' => 'topsongs',
            ),
            'LASTFM'   => array(
                'TEXT'     => $this->locale['menu.lastfm'],
                'PAGE'     => 'playlist-container',
                'PLAYLIST' => 'lastfm',
            ),
            'SEARCH'   => array(
                'TEXT'     => $this->locale['menu.search'],
                'PAGE'     => 'playlist-container',
                'PLAYLIST' => 'search',
            ),
            'USERLIST' => array(
                'TEXT'     => $this->locale['menu.userlist'],
                'PAGE'     => 'playlist-container',
                'PLAYLIST' => 'userlist',
            ),
            'YTPLAYER' => array(
                'TEXT' => $this->locale['menu.youtube'],
                'PAGE' => 'video-container'
            )
        );
    }

    private function getYoutube() {
        return array();
    }

    private function getPlaylist($user = false, $pageNum = 1) {

        if ($this->isValidUser($user)) {
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $pageNum                            = false;
            }
        }
        else if (!$this->isValidUser($_SESSION ['music'] ['lastfm_user'])) {
            $_SESSION ['music'] ['lastfm_user'] = $this->settings['general']['lastfm_defaultuser'];
        }


        $this->lfmapi->setUser($_SESSION['music']['lastfm_user']);
        if ($pageNum === false || $pageNum < 1) $pageNum = 1;


        $maxpages  = $this->settings['general']['tracks_perpage'];
        $playlist  = $this->lfmapi->getRecentlyPlayed($pageNum, $maxpages);
        $tracks    = $playlist->getTracks();
        $pageStart = (($pageNum - 1) * $maxpages);
        
        $page = array(

            'HEADER' => array(
                'TEXT'       => $this->locale['playlist.title'],
                'URL'        => '//last.fm/user/' . $this->lfmapi->getUser(),
                'URL_TARGET' => '_blank',
                'PLAYLIST'   => 'lastfm'
            ),

            'HEADER_MENU' => self::getPlaylistMenu(),

            'LIST_MENU' => array(
                'LASTFM_USER_NAME_LABEL' => $this->locale['playlist.control.user'],
                'LASTFM_USER_NAME'       => $this->lfmapi->getUser(),
                'CUR_PAGE_LABEL'         => $this->locale['playlist.control.page'],
                'PAGES_OF_LABEL'         => $this->locale['playlist.control.pageof'],
                'MAX_PAGES'              => $playlist->getTotalPages(),
                'CUR_PAGE'               => $pageNum,
                'PLAYLIST_LOAD'          => $this->locale['playlist.control.load'],
                'playlist'               => 'lastfm'
            ),
            //lastfm navigation (pages/username)

            'LIST_HEADER' => array(
                'TRACK_NR'       => $this->locale['playlist.header.nr'],
                'TRACK_ARTIST'   => $this->locale['playlist.header.artist'],
                'TRACK_TITLE'    => $this->locale['playlist.header.title'],
                'TRACK_LASTPLAY' => $this->locale['playlist.header.lastplay']
            )
        );

        $page['TRACKS'] = array();
        for ($cnt = 0; $cnt < sizeof($tracks); $cnt++) {
            /**
             * @var Track
             */
            $track   = $tracks[$cnt];
            $videoId = $this->db->getEnvVar($track->getArtist() . ' ' . $track->getTitle());

            $page['TRACKS'][] = array(
                'NR'               => ($pageStart + $cnt + 1),
                'ARTIST'           => $track->getArtist(),
                'TITLE'            => $track->getTitle(),
                'LASTPLAY'         => $track->isPlaying() ?
                    $this->locale['playlist.lastplay.now'] :
                    $this->funcs->formatDate($track->getDateofPlay()),
                'LASTFM_ISPLAYING' => $track->isPlaying(),
                'VIDEO_ID'         => $videoId,
                'PLAY_CONTROL'     => false,
                'PLAYLIST'         => 'lastfm',
                'PLAYSTATE'        => ''
            );
        }
        //playlist content
        return $page;
    }

    private function isValidUser($user) {
        return (isset($user) &&
                $user !== false &&
                $user != null &&
                strlen(filter_var($user, FILTER_SANITIZE_STRING)) > 0
        );
    }

    private function getTopUser($pageNum = 1, $user = false, $lastplay = '1970-01-01 00:00:00') {

        if ($user !== false) {
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $pageNum                            = false;
            }
        }

        $limit  = $this->settings['general']['tracks_perpage'];
        $offset = ($pageNum - 1) * $limit;

        $topuser  = $this->db->query('SELECT_ALL_LASTFM_USER', $limit, $offset);
        $maxpages = $this->db->query('SELECT_ALL_LASTFM_USER_NUM_ROWS');
        $maxpages = ((int)($maxpages / $limit));

        if (($maxpages % $limit) > 0) $maxpages++;
        if ($maxpages <= 0) $maxpages = 1;

        $page = array(

            'HEADER' => array(
                'TEXT'       => $this->locale['menu.topuser'],
                'URL_TARGET' => '_self',
                'TYPE'       => 'topuser',
            ),


            'HEADER_MENU' => $this->getPlaylistMenu(),

            'LIST_MENU' => array(
                'MAX_PAGES' => $maxpages,
                'CUR_PAGE'  => $pageNum
            ),
            //lastfm navigation (pages/username)

            'LIST_HEADER' => array(
                'USER_NR'        => $this->locale['playlist.header.nr'],
                'USER_NAME'      => $this->locale['playlist.header.name'],
                'USER_LASTPLAY'  => $this->locale['playlist.header.lastplay'],
                'USER_PLAYCOUNT' => $this->locale['playlist.header.playcount'],
            )
        );

        $page['USER'] = array();
        for ($cnt = 0; $cnt < sizeof($topuser); $cnt++) {
            $user = $topuser[$cnt];

            $page['USER'][] = array(
                'NR'           => ($offset + $cnt + 1),
                'NAME'         => $user['lastfm_user'],
                'LASTPLAY'     => $this->funcs->formatDate($user['last_played']),
                'PLAYCOUNT'    => $user['playcount'],
                'PLAY_CONTROL' => '',
            );
        }

        return $page;
    }

    private function getTopSongs($pageNum = 1) {


        $limit    = $this->settings['general']['tracks_perpage'];
        $offset   = ($pageNum - 1) * $limit;
        $topsongs = $this->db->query('SELECT_CHARTS', $limit, $offset);
        $maxpages = $this->db->query('SELECT_CHARTS_NUM_ROWS');
        $maxpages = ((int)($maxpages / $limit));
        if (($maxpages % $limit) > 0) $maxpages++;

        $page = array(

            'HEADER' => array(
                'TEXT'       => $this->locale['menu.topsongs'],
                'URL'        => '#playlist-container',
                'URL_TARGET' => '_self',
                'PLAYLIST'   => 'topsongs',
            ),


            'HEADER_MENU' => $this->getPlaylistMenu(),

            'LIST_MENU' => array(
                'MAX_PAGES' => $maxpages,
                'CUR_PAGE'  => $pageNum,
                'playlist'  => 'topsongs'
            ),
            //lastfm navigation (pages/username)

            'LIST_HEADER' => array(
                'TRACK_NR'        => $this->locale['playlist.header.nr'],
                'TRACK_ARTIST'    => $this->locale['playlist.header.artist'],
                'TRACK_TITLE'     => $this->locale['playlist.header.title'],
                'TRACK_LASTPLAY'  => $this->locale['playlist.header.lastplay'],
                'TRACK_PLAYCOUNT' => $this->locale['playlist.header.playcount'],
            )
        );

        $page['TRACKS'] = array();
        for ($cnt = 0; $cnt < sizeof($topsongs); $cnt++) {
            $track              = $topsongs[$cnt];
            $track['interpret'] = $this->funcs->prepareNeedle($track['interpret']);
            $track['title']     = $this->funcs->prepareNeedle($track['title']);
            $videoId            = $this->db->getEnvVar($track['interpret'] . ' ' . $track['title']);

            $page['TRACKS'][] = array(
                'NR'               => ($offset + $cnt + 1),
                'ARTIST'           => $track['interpret'],
                'TITLE'            => $track['title'],
                'LASTPLAY'         => Functions::getInstance()->formatDate($track['lastplay_time']),
                'LASTFM_ISPLAYING' => false,
                'PLAYCOUNT'        => $track['playcount'],
                'VIDEO_ID'         => $videoId,
                'PLAY_CONTROL'     => false,
                'PLAYLIST'         => 'topsongs',
                'PLAYSTATE'        => ''
            );
        }

        return $page;
    }

    private function getDataType($getvars) {
        if (isset($getvars['data']) && trim(strlen($getvars['data'])) > 0) return $getvars['data'];
        return $this->apiName;
    }

}