<?php
/**
 * User: ravermeister
 * Date: 09.09.2018
 * Time: 23:31
 */

namespace LastFmTube\Json;

use LastFmTube\Util\Functions;
use LastFmTube\Util\lfmapi\Track;

class VuePageData {
    public $el;
    public $data;
}

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

        if (!isset($getvars['data'])) $getvars['data'] = 'mainpage';

        switch (strtolower($getvars['data'])) {
            case 'pagedata':
                return $this->getPageData();
        }

        return $this->jsonError('Falsche Parameterangabe');
    }

    /**
     * @return false|string
     */
    private function getPageData() {

        $data                = new VuePageData();
        $data->el            = 'head>title';
        $data->data['TITLE'] = $this->locale['site.title'];
        $page[]              = $data;
        //title

        $data                  = new VuePageData();
        $data->el              = 'header>nav';
        $data->data['MENUS'][] = array('URL' => '#page-ytplayer', 'NAME' => 'Player',);
        $data->data['MENUS'][] = array('URL' => '#page-playlist', 'NAME' => $this->locale['playlist.title'],);
        $data->data['MENUS'][] = array('URL' => '#page-user', 'NAME' => $this->locale['userplaylist.title'],);
        $data->data['MENUS'][] = array('URL' => '#page-topuser', 'NAME' => $this->locale['topuser.title'],);
        $data->data['MENUS'][] = array('URL' => '#page-charts', 'NAME' => $this->locale['charts.title'],);
        $page[]                = $data;
        //nav

        $data                       = new VuePageData();
        $data->el                   = 'header>.content';
        $data->data['PAGE_HEADER']  = $this->locale['site.title'];
        $data->data['PAGE_WELCOME'] = $this->locale['site.header.text'];
        $page[]                     = $data;
        //header content

        $data                           = new VuePageData();
        $data->el                       = '#page-playlist>h2';
        $data->data['LASTFM_USER_NAME'] = $this->lfmapi->getUser();
        $data->data['LASTFM_USER_URL']  = '//last.fm/user/' . $this->lfmapi->getUser();
        $page[]                         = $data;
        $data                           = new VuePageData();
        $data->el                       = '#page-playlist>.table-wrapper>table>thead';
        $data->data['TRACK_NR']         = $this->locale['playlist.header.nr'];
        $data->data['TRACK_ARTIST']     = $this->locale['playlist.header.artist'];
        $data->data['TRACK_TITLE']      = $this->locale['playlist.header.title'];
        $data->data['TRACK_LASTPLAY']   = $this->locale['playlist.header.lastplay'];
        $page[]                         = $data;


        $playlist = $this->lfmapi->getRecentlyPlayed();
        $tracks   = $playlist->getTracks();
        $data     = new VuePageData();
        $data->el = '#page-playlist>.table-wrapper>table>tbody';
        for ($cnt = 0; $cnt < sizeof($tracks); $cnt++) {
            /**
             * @var Track
             */
            $track                               = $tracks[$cnt];
            $data->data['ADD_TO_PLAYLIST_TITLE'] = $this->locale['playlist.addtrack'];

            $data->data['TRACKS'][] = array('NR'    => ($cnt + 1),
                                            'ARTIST' => $track->getArtist(),
                                            'TITLE' => $track->getTitle(),
                                            'LASTPLAY' => $track->isPlaying() ?
                                                $this->locale['playlist.lastplay.now'] :
                                                $track->getDateofPlay()

            );
        }
        $page[] = $data;
        //playlist content


        return $this->jsonData($page, 'pagedata');
    }

}