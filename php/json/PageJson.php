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
                    $data = $this->getPageData();
                    $type = 'pagedata';
                    break;
                case 'playlist':
                    $user     = isset($getvars['user']) ? $getvars['user'] : false;
                    $page     = isset($getvars['page']) ? $getvars['page'] : false;
                    $playlist = isset($getvars['type']) ? $getvars['type'] : 'default';
                    switch ($playlist) {
                        case 'topsongs':
                            $data = $this->getTopSongsData($page);
                            break;

                        case 'default:':
                        default:
                            $data = $this->getPlaylistData($user, $page);
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
    private function getPageData() {
        $page     = $this->getBasePageData();
        $playlist = $this->getPlaylistData();
        $page     = array_merge($page, $playlist);
        return $page;
    }

    public function getBasePageData() {
        $data                = new VuePageData();
        $data->el            = 'head>title';
        $data->data['TITLE'] = $this->locale['site.title'];
        $page['HEAD_TITLE']  = $data;
        //title

        $data                  = new VuePageData();
        $data->el              = 'header>nav';
        $data->data['MENUS'][] = array(
            'URL'  => '#page-ytplayer',
            'NAME' => 'Player',
            'ARGS' => array(
                'PLAYLIST' => null
            )
        );
        $data->data['MENUS'][] = array(
            'URL'  => '#page-playlist',
            'NAME' => $this->locale['playlist.title'],
            'ARGS' => array(
                'PLAYLIST' => 'default'
            )
        );
        $data->data['MENUS'][] = array(
            'URL'  => '#page-playlist',
            'NAME' => $this->locale['userplaylist.title'],
            'ARGS' => array(
                'PLAYLIST' => 'userlist'
            )
        );
        $data->data['MENUS'][] = array(
            'URL'  => '#page-playlist',
            'NAME' => $this->locale['topuser.title'],
            'ARGS' => array(
                'PLAYLIST' => null
            )
        );
        $data->data['MENUS'][] = array(
            'URL'  => '#page-playlist',
            'NAME' => $this->locale['charts.title'],
            'ARGS' => array(
                'PLAYLIST' => 'topsongs'
            )
        );
        $page['NAV']           = $data;
        //nav

        $data                       = new VuePageData();
        $data->el                   = 'header>.content';
        $data->data['PAGE_HEADER']  = $this->locale['site.title'];
        $data->data['PAGE_WELCOME'] = $this->locale['site.header.text'];
        $page['HEADER_CONTENT']     = $data;
        //header content

        return $page;
    }

    private function getPlaylistData($user = false, $pageNum = 1) {
        if ($user !== false) {
            Functions::getInstance()->startSession();
            if (strcmp($_SESSION ['music'] ['lastfm_user'], $user) != 0) {
                $_SESSION ['music'] ['lastfm_user'] = $user;
                $this->lfmapi->setUser($user);
                $pageNum = false;
            }
        }
        if ($pageNum === false || $pageNum < 1) $pageNum = 1;

        $maxpages = $this->settings['general']['tracks_perpage'];
        $playlist = $this->lfmapi->getRecentlyPlayed($pageNum, $maxpages);


        $data                           = new VuePageData();
        $data->el                       = '#page-playlist>h2';
        $data->data['LASTFM_USER_NAME'] = $this->lfmapi->getUser();
        $data->data['LASTFM_USER_URL']  = '//last.fm/user/' . $this->lfmapi->getUser();
        $page['PLAYLIST_HEADER']        = $data;

        $data                                 = new VuePageData();
        $data->el                             = '#page-playlist>.playlist-nav';
        $data->data['LASTFM_USER_NAME_LABEL'] = $this->locale['site.playercontrol.user.label'];
        $data->data['LASTFM_USER_NAME']       = $this->lfmapi->getUser();
        $data->data['CUR_PAGE_LABEL']         = $this->locale['site.pagecontrol.page'];
        $data->data['PAGES_OF_LABEL']         = $this->locale['site.pagecontrol.page.of'];
        $data->data['MAX_PAGES']              = $playlist->totalpages;
        $data->data['CUR_PAGE']               = $pageNum;
        $data->data['PLAYLIST_LOAD']          = $this->locale['site.pagecontrol.load'];
        $data->data['PLAYLIST']               = 'default';
        $page['PLAYLIST_NAV']                 = $data;
        //lastfm navigation (pages/username)


        $data                           = new VuePageData();
        $data->el                       = '#playlist-content>table>thead';
        $data->data['TRACK_NR']         = $this->locale['playlist.header.nr'];
        $data->data['TRACK_ARTIST']     = $this->locale['playlist.header.artist'];
        {}      $data->data['TRACK_TITLE']      = $this->locale['playlist.header.title'];
        $data->data['TRACK_LASTPLAY']   = $this->locale['playlist.header.lastplay'];
        $page['PLAYLIST_TRACKS_HEADER'] = $data;


        $tracks    = $playlist->getTracks();
        $data      = new VuePageData();
        $data->el  = '#playlist-content';
        $pageStart = (($pageNum - 1) * $maxpages);
        $db        = DB::getInstance();
        for ($cnt = 0; $cnt < sizeof($tracks); $cnt++) {
            /**
             * @var Track
             */
            $track                               = $tracks[$cnt];
            $data->data['ADD_TO_PLAYLIST_TITLE'] = $this->locale['playlist.addtrack'];
            $videoId                             = $db->getEnvVar($track->getArtist() . ' ' . $track->getTitle());
            $data->data['TRACKS'][]              = array(
                'NR'           => ($pageStart + $cnt + 1),
                'ARTIST'       => $track->getArtist(),
                'TITLE'        => $track->getTitle(),
                'LASTPLAY'     => $track->isPlaying() ?
                    $this->locale['playlist.lastplay.now'] :
                    $track->getDateofPlay(),
                'VIDEO_ID'     => $videoId,
                'PLAY_CONTROL' => false,
                'PLAYLIST'     => 'default'
            );


        }
        $page['PLAYLIST_TRACKS'] = $data;
        //playlist content

        return $page;
    }


    private function getTopSongsData($pageNum = 1) {
        $limit    = $this->settings['general']['tracks_perpage'];
        $offset   = ($pageNum - 1) * $limit;
        $topsongs = Db::getInstance()->query('SELECT_CHARTS', $limit, $offset);
        $maxpages = Db::getInstance()->query('SELECT_CHARTS_NUM_ROWS');
        $maxpages = ((int)($maxpages / $limit));
        if (($maxpages % $limit) > 0) $maxpages++;
        $page = array();

        $data                    = new VuePageData();
        $data->el                = '#page-playlist>h2';
        $data->data['MAX_PAGES'] = $maxpages;
        $data->data['CUR_PAGE']  = $pageNum;
        $data->data['PLAYLIST']  = 'topsongs';
        $page['PLAYLIST_NAV']    = $data;
        //lastfm navigation (pages/username)


        $data                           = new VuePageData();
        $data->el                       = '#playlist-content>table>thead';
        $data->data['TRACK_NR']         = $this->locale['playlist.header.nr'];
        $data->data['TRACK_ARTIST']     = $this->locale['playlist.header.artist'];
        $data->data['TRACK_TITLE']      = $this->locale['playlist.header.title'];
        $data->data['TRACK_LASTPLAY']   = $this->locale['playlist.header.lastplay'];
        $page['PLAYLIST_TRACKS_HEADER'] = $data;

        $data     = new VuePageData();
        $data->el = '#playlist-content';

        $db = DB::getInstance();
        for ($cnt = 0; $cnt < sizeof($topsongs); $cnt++) {
            $track                               = $topsongs[$cnt];
            $data->data['ADD_TO_PLAYLIST_TITLE'] = $this->locale['playlist.addtrack'];
            $track['interpret']                  = Functions::getInstance()->prepareNeedle($track['interpret']);
            $track['title']                      = Functions::getInstance()->prepareNeedle($track['title']);
            $videoId                             = $db->getEnvVar($track['interpret'] . ' ' . $track['title']);

            $data->data['TRACKS'][] = array('NR'           => ($offset + $cnt + 1),
                                            'ARTIST'       => $track['interpret'],
                                            'TITLE'        => $track['title'],
                                            'LASTPLAY'     => $track['lastplay_time'],
                                            'LASTPLAY_IP'  => $track['lastplay_ip'],
                                            'PLAYCOUNT'    => $track['playcount'],
                                            'VIDEO_ID'     => $videoId,
                                            'PLAY_CONTROL' => false,
                                            'PLAYLIST'     => 'topsongs'
            );
        }
        $page['PLAYLIST_TRACKS'] = $data;

        return $page;
    }

}