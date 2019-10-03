<?php
namespace LastFmTube\Api\LastFm;

use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

class Track
{

    /**
     *
     * @var string
     */
    private $artist;

    /**
     *
     * @var string
     */
    private $title;

    /**
     *
     * @var string
     */
    private $album;

    /**
     *
     * @var bool
     */
    private $isplaying;

    /**
     *
     * @var string
     */
    private $dateofPlay;

    /**
     *
     * @var integer
     */
    private $playcount;

    /**
     * Track constructor.
     *
     * @param
     *            $artist
     * @param
     *            $title
     * @param
     *            $album
     * @param string $lastplay
     * @param bool $isPlaying
     */
    public function __construct($artist, $title, $album = '', $lastplay = '', $isPlaying = false)
    {
        $this->artist = $artist;
        $this->title = $title;
        $this->album = $album;

        $this->dateofPlay = $lastplay;
        $this->isPlaying = $isPlaying;
    }

    public static function fromXML($trackxml)
    {

        // $this->dateofplay = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));
        $isPlaying = false;
        if ($trackxml->children(10) !== null) {
            $timestamp = $trackxml->children(10)->uts;

            if ($timestamp <= 0) {
                // timestamp 0 means currently playing!
                $lastplay = Functions::getInstance()->getLocale()['playlist.nowplaying'];
                $isPlaying = true;
            } else {
                $lastplay = date('Y-m-d H:i:s', $trackxml->children(10)->uts);
                $isPlaying = false;
            }
        } else {
            // no timestamp means currently playing (tested)
            $lastplay = Functions::getInstance()->getLocale()['playlist.nowplaying'];
            $isPlaying = true;
        }

        return new Track(Functions::getInstance()->decodeHTML($trackxml->children(0)->innertext), Functions::getInstance()->decodeHTML($trackxml->children(1)->innertext), Functions::getInstance()->decodeHTML($trackxml->children(4)->innertext), $lastplay, $isPlaying);
    }

    /**
     *
     * @return bool
     */
    public function isPlaying()
    {
        return $this->isPlaying;
    }

    /**
     *
     * @return string
     */
    public function getAlbum()
    {
        return $this->album;
    }

    /**
     *
     * @return string
     */
    public function getArtist()
    {
        return $this->artist;
    }

    public function setArtist($artist)
    {
        $this->artist = $artist;
    }

    /**
     *
     * @return string
     */
    public function getDateofPlay()
    {
        return $this->dateofPlay;
    }

    /**
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getPlayCount()
    {
        return $this->playcount;
    }

    public function setPlayCount($playount)
    {
        $this->playcount = $playount;
    }

    public function normalize()
    {
        $replacements = Db::getInstance()->getReplaceTrackMap();

        foreach ($replacements as $row) {

            $orig_artist_expr = '/' . $row['orig_artist_expr'] . '/';
            $orig_title_expr = '/' . $row['orig_title_expr'] . '/';
            $repl_artist = str_replace(DB::$ARTIST_REPLACEMENT_REGEX_IDENTIFIER, '$', $row['repl_artist']);
            $repl_title = str_replace(DB::$TITLE_REPLACEMENT_REGEX_IDENTIFIER, '$', $row['repl_title']);

            if (preg_match($orig_artist_expr, $this->artist) === 1 && preg_match($orig_title_expr, $this->title) === 1) {
                $this->artist = preg_replace($orig_artist_expr, $repl_artist, $this->artist);
                $repl_artist = str_replace(DB::$TITLE_REPLACEMENT_REGEX_IDENTIFIER, '$', $repl_artist);
                $repl_title_artist = preg_replace($orig_title_expr, $repl_artist, $this->title);
                if (strpos($this->artist, DB::$TITLE_REPLACEMENT_REGEX_IDENTIFIER) !== 0 && strcmp($repl_title_artist, $this->title) !== 0) {
                    $this->artist = $repl_title_artist;
                }

                $this->title = preg_replace($orig_title_expr, $repl_title, $this->title);
                $repl_title = str_replace(DB::$ARTIST_REPLACEMENT_REGEX_IDENTIFIER, '$', $repl_title);
                $repl_artist_title = preg_replace($orig_artist_expr, $repl_title, $this->artist);
                if (strpos($this->artist, DB::$ARTIST_REPLACEMENT_REGEX_IDENTIFIER) !== 0 && strcmp($repl_artist_title, $this->artist) !== 0) {
                    $this->title = $repl_artist_title;
                }

                // stop prcessing when pattern matched
                break;
            }
        }
    }
}