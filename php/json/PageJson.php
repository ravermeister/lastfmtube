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

    public function __construct() {
        parent::__construct('page');
        $funcs = Functions::getInstance();
        $funcs->startSession();

        $this->settings = $funcs->getSettings();
        $this->locale   = $funcs->getLocale();
        $this->lfmapi   = $funcs->getLfmApi();
    }

    public function get($getvars) {

        if (!isset($getvars['data'])) $getvars['data'] = 'page';
        try {
            $data = false;
            $type = false;
            switch (strtolower($getvars['data'])) {
                case 'page':
                    $data = $this->getPage();
                    $type = 'pagedata';
                    break;
                case 'playlist':
                    $user     = isset($getvars['user']) ? $getvars['user'] : false;
                    $page     = isset($getvars['page']) ? $getvars['page'] : false;
                    $playlist = isset($getvars['type']) ? $getvars['type'] : 'default';
                    switch ($playlist) {
                        case 'topsongs':
                            $data = $this->getTopSongs($page);
                            break;

                        case 'default:':
                        default:
                            $data = $this->getPlaylist($user, $page);
                            break;
                    }

                    $type = 'playlist';
                    break;
                default:
                    return $this->jsonError('Falsche Parameterangabe');
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
        return $page;
    }

    public function getBase() {

        return array(
            'TITLE' => $this->locale['site.title'],
            'TEXT'  => $this->locale['site.header.text'],
            'MENU'  => array(
                array(
                    'URL'  => '#page-ytplayer',
                    'NAME' => 'Player',
                    'ARGS' => array(
                        'PLAYLIST' => null
                    ),
                ),
                array(
                    'URL'  => '#page-playlist',
                    'NAME' => $this->locale['menu.lastfm'],
                    'ARGS' => array(
                        'PLAYLIST' => 'default'
                    ),
                ),
                array(
                    'URL'  => '#page-playlist',
                    'NAME' => $this->locale['menu.userlist'],
                    'ARGS' => array(
                        'PLAYLIST' => 'userlist'
                    )
                ),
                array(
                    'URL'  => '#page-playlist',
                    'NAME' => $this->locale['menu.topuser'],
                    'ARGS' => array(
                        'PLAYLIST' => 'topuser',
                    )
                ),
                array(
                    'URL'  => '#page-playlist',
                    'NAME' => $this->locale['menu.topsongs'],
                    'ARGS' => array(
                        'PLAYLIST' => 'topsongs'
                    )
                ),
            )
        );
        //header content
    }


    private function getYoutube() {
        return array(
            'PLAYLIST_NAME' => 'Last.fm',
            'PLAYLIST_URL'  => '#page-playlist',
            'PLAYLIST_ID'   => 'default'
        );
    }

    private function getPlaylist($user = false, $pageNum = 1) {

        if ($user !== false) {
            Functions::getInstance()->startSession();
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $this->lfmapi->setUser($user);
                $pageNum = false;
            }
        }
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
                'PLAYLIST'   => 'default'
            ),

            'HEADER_MENU' => array(
                'TOPUSER'  => array(
                    'TEXT' => $this->locale['menu.topuser'],
                ),
                'TOPSONGS' => array(
                    'TEXT' => $this->locale['menu.topsongs'],
                ),
                'DEFAULT'  => array(
                    'TEXT' => $this->locale['menu.lastfm'],
                ),
                'SEARCH'   => array(
                    'TEXT' => $this->locale['menu.search'],
                ),
                'USERLIST' => array(
                    'TEXT' => $this->locale['menu.userlist'],
                ),
                'YTPLAYER' => array(
                    'TEXT' => $this->locale['menu.youtube'],
                )
            ),

            'LIST_MENU' => array(
                'LASTFM_USER_NAME_LABEL' => $this->locale['playlist.control.user'],
                'LASTFM_USER_NAME'       => $this->lfmapi->getUser(),
                'CUR_PAGE_LABEL'         => $this->locale['playlist.control.page'],
                'PAGES_OF_LABEL'         => $this->locale['playlist.control.pageof'],
                'MAX_PAGES'              => $playlist->totalPages,
                'CUR_PAGE'               => $pageNum,
                'PLAYLIST_LOAD'          => $this->locale['playlist.control.load'],
                'PLAYLIST'               => 'default'
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
            $videoId = $db->getEnvVar($track->getArtist() . ' ' . $track->getTitle());

            $page['TRACKS'][] = array(
                'NR'           => ($pageStart + $cnt + 1),
                'ARTIST'       => $track->getArtist(),
                'TITLE'        => $track->getTitle(),
                'LASTPLAY'     => $track->isPlaying() ?
                    $this->locale['playlist.lastplay.now'] :
                    $track->getDateofPlay(),
                'VIDEO_ID'     => $videoId,
                'PLAY_CONTROL' => false,
                'PLAYLIST'     => 'default',
                'PLAYSTATE'    => ''
            );
        }
        //playlist content

        return $page;
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


            'HEADER_MENU' => array(
                'TOPUSER'  => array(
                    'TEXT' => $this->locale['menu.topuser'],
                ),
                'TOPSONGS' => array(
                    'TEXT' => $this->locale['menu.topsongs'],
                ),
                'DEFAULT'  => array(
                    'TEXT' => $this->locale['menu.lastfm'],
                ),
                'SEARCH'   => array(
                    'TEXT' => $this->locale['menu.search'],
                ),
                'USERLIST' => array(
                    'TEXT' => $this->locale['menu.userlist'],
                ),
                'YTPLAYER' => array(
                    'TEXT' => $this->locale['menu.youtube'],
                )
            ),

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


}