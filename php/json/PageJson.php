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

    public function __construct($api = 'page') {
        parent::__construct($api);

        $funcs = Functions::getInstance();
        $funcs->startSession();

        $this->settings = $funcs->getSettings();
        $this->locale   = $funcs->getLocale();
        $this->lfmapi   = $funcs->getLfmApi();
    }

    public function get($getvars) {
        try {
            $data     = false;
            $type     = false;
            $parmData = isset($getvars['data']) ? strtolower($getvars['data']) : strtolower($this->apiName);

            switch ($parmData) {
                case 'page':
                    $data = $this->getPage();
                    $type = 'pagedata';
                    break;
                case 'playlist':
                    $user     = isset($getvars['user']) ? $getvars['user'] : false;
                    $page     = isset($getvars['page']) ? $getvars['page'] : false;
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

    private function getBaseMenu() {
        $menu = self::getPlaylistMenu();
        $basemenu = array();
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
    
    private function getBase() {

        return array(
            'TITLE' => $this->locale['site.title'],
            'TEXT'  => $this->locale['site.header.text'],
            'MENU'  => $this->getBaseMenu()
        );
        //header content
        
    }

    private function getYoutube() {
        return array(
            'PLAYLIST_NAME' => 'Last.fm',
            'PLAYLIST_URL'  => '#lastfm',
            'PLAYLIST_ID'   => 'lastfm'
        );
    }

    private function getPlaylist($user = false, $pageNum = 1) {
        Functions::getInstance()->startSession();

        if ($user !== false && $user != null && strlen(filter_var($user,FILTER_SANITIZE_STRING)) > 0) {
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $pageNum                            = false;
            }
        }

        if (!isset($_SESSION['music']['lastfm_user']) || strlen(trim($_SESSION ['music'] ['lastfm_user'])) == 0) {
            $_SESSION ['music'] ['lastfm_user'] = $this->settings['general']['defaultlfmuser'];
        }

        $this->lfmapi->setUser($_SESSION['music']['lastfm_user']);
        if ($pageNum === false || $pageNum < 1) $pageNum = 1;


        $maxpages  = $this->settings['general']['tracks_perpage'];
        $playlist  = $this->lfmapi->getRecentlyPlayed($pageNum, $maxpages);
        $tracks    = $playlist->getTracks();
        $pageStart = (($pageNum - 1) * $maxpages);
        $db        = DB::getInstance();

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
                'MAX_PAGES'              => $playlist->totalPages,
                'CUR_PAGE'               => $pageNum,
                'PLAYLIST_LOAD'          => $this->locale['playlist.control.load'],
                'PLAYLIST'               => 'lastfm'
            ),
            //lastfm navigation (pages/username)

            'LIST_HEADER' => array(
                'TRACK_NR'       => $this->locale['playlist.header.nr'],
                'TRACK_ARTIST'   => $this->locale['playlist.header.artist'],
                'TRACK_TITLE'    => $this->locale['playlist.header.title'],
                'TRACK_LASTPLAY' => $this->locale['playlist.header.lastplay']
            )
        );

        for ($cnt = 0; $cnt < sizeof($tracks); $cnt++) {
            /**
             * @var Track
             */
            $track   = $tracks[$cnt];
            $artist  = Functions::getInstance()->prepareNeedle($track->getArtist());
            $title   = Functions::getInstance()->prepareNeedle($track->getTitle());
            $videoId = $db->getEnvVar($artist . ' ' . $title);

            $page['TRACKS'][] = array(
                'NR'           => ($pageStart + $cnt + 1),
                'ARTIST'       => $track->getArtist(),
                'TITLE'        => $track->getTitle(),
                'LASTPLAY'     => $track->isPlaying() ?
                    $this->locale['playlist.lastplay.now'] :
                    $track->getDateofPlay(),
                'VIDEO_ID'     => $videoId,
                'PLAY_CONTROL' => false,
                'PLAYLIST'     => 'playlist',
                'PLAYSTATE'    => ''
            );
        }
        //playlist content

        return $page;
    }

    private function getPlaylistMenu() {
        return array(
            'TOPUSER'  => array(
                'TEXT'     => $this->locale['menu.topuser'],
                'PAGE'     => 'page-user'
            ),
            'TOPSONGS' => array(
                'TEXT'     => $this->locale['menu.topsongs'],
                'PAGE'     => 'page-playlist',
                'PLAYLIST' => 'topsongs',
            ),
            'LASTFM'   => array(
                'TEXT'     => $this->locale['menu.lastfm'],
                'PAGE'     => 'page-playlist',
                'PLAYLIST' => 'lastfm',
            ),
            'SEARCH'   => array(
                'TEXT'     => $this->locale['menu.search'],
                'PAGE'     => 'page-playlist',
                'PLAYLIST' => 'search',
            ),
            'USERLIST' => array(
                'TEXT'     => $this->locale['menu.userlist'],
                'PAGE'     => 'page-playlist',
                'PLAYLIST' => 'userlist',
            ),
            'YTPLAYER' => array(
                'TEXT' => $this->locale['menu.youtube'],
                'PAGE' => 'page-video'
            )
        );
    }

    private function getTopSongs($pageNum = 1) {

        $db       = DB::getInstance();
        $limit    = $this->settings['general']['tracks_perpage'];
        $offset   = ($pageNum - 1) * $limit;
        $topsongs = Db::getInstance()->query('SELECT_CHARTS', $limit, $offset);
        $maxpages = Db::getInstance()->query('SELECT_CHARTS_NUM_ROWS');
        $maxpages = ((int)($maxpages / $limit));
        if (($maxpages % $limit) > 0) $maxpages++;

        $page = array(

            'HEADER' => array(
                'TEXT'       => $this->locale['menu.topsongs'],
                'URL'        => '#page-playlist',
                'URL_TARGET' => '_self',
                'PLAYLIST'   => 'topsongs',
            ),


            'HEADER_MENU' => self::getPlaylistMenu(),

            'LIST_MENU' => array(
                'MAX_PAGES' => $maxpages,
                'CUR_PAGE'  => $pageNum,
                'PLAYLIST'  => 'topsongs'
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

        for ($cnt = 0; $cnt < sizeof($topsongs); $cnt++) {
            $track              = $topsongs[$cnt];
            $track['interpret'] = Functions::getInstance()->prepareNeedle($track['interpret']);
            $track['title']     = Functions::getInstance()->prepareNeedle($track['title']);
            $videoId            = $db->getEnvVar($track['interpret'] . ' ' . $track['title']);

            $page['TRACKS'][] = array(
                'NR'           => ($offset + $cnt + 1),
                'ARTIST'       => $track['interpret'],
                'TITLE'        => $track['title'],
                'LASTPLAY'     => $track['lastplay_time'],
                'PLAYCOUNT'    => $track['playcount'],
                'VIDEO_ID'     => $videoId,
                'PLAY_CONTROL' => false,
                'PLAYLIST'     => 'topsongs'
            );
        }

        return $page;
    }

    private function getTopUser($pageNum = 1, $user = false, $lastplay = '1970-01-01 00:00:00') {
        Functions::getInstance()->startSession();

        if ($user !== false) {
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $pageNum                            = false;
            }
        }

        $user   = $_SESSION ['music'] ['lastfm_user'];
        $db     = DB::getInstance();
        $limit  = $this->settings['general']['tracks_perpage'];
        $offset = ($pageNum - 1) * $limit;

        Functions::getInstance()->logMessage("execute topuser query with $user, $lastplay, $offset, $limit");
        $topuser  = Db::getInstance()->query('SELECT_ALL_LASTFM_USER', $user, $lastplay, $limit, $offset);
        $maxpages = Db::getInstance()->query('SELECT_ALL_LASTFM_USER_NUM_ROWS');
        $maxpages = ((int)($maxpages / $limit));

        if (($maxpages % $limit) > 0) $maxpages++;
        if ($maxpages <= 0) $maxpages = 1;

        $page = array(

            'HEADER' => array(
                'TEXT'       => $this->locale['menu.topuser'],
                'URL_TARGET' => '_self',
                'PLAYLIST'   => 'topuser',
            ),


            'HEADER_MENU' => self::getPlaylistMenu(),

            'LIST_MENU' => array(
                'MAX_PAGES' => $maxpages,
                'CUR_PAGE'  => $pageNum,
                'PLAYLIST'  => 'topuser'
            ),
            //lastfm navigation (pages/username)

            'LIST_HEADER' => array(
                'USER_NR'        => $this->locale['playlist.header.nr'],
                'USER_NAME'      => $this->locale['playlist.header.name'],
                'USER_LASTPLAY'  => $this->locale['playlist.header.lastplay'],
                'USER_PLAYCOUNT' => $this->locale['playlist.header.playcount'],
            )
        );

        for ($cnt = 0; $cnt < sizeof($topuser); $cnt++) {
            $track = $topuser[$cnt];

            $page['USER'][] = array(
                'NR'        => ($offset + $cnt + 1),
                'NAME'      => $track['lastfm_user'],
                'LASTPLAY'  => $track['last_played'],
                'PLAYCOUNT' => $track['playcount']
            );
        }

        return $page;
    }

    private function getDataType($getvars) {
        if (isset($getvars['data']) && trim(strlen($getvars['data'])) > 0) return $getvars['data'];
        return $this->apiName;
    }

}