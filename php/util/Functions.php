<?php

namespace LastFmTube\Util;

use Exception;
use LastFmTube\Util\lfmapi\LastFm;
use LastFmTube\Util\ytapi\YoutubeSearch;

class Functions {

    private static $instance;
    private        $basedir         = false;
    private        $settings        = false;
    private        $settingsFile    = false;
    private        $replacements    = false;
    private        $replacementFile = false;
    private        $lfmapi          = null;
    private        $ytapi           = null;
    private        $locale          = null;


    private function __construct($file = false) {
        $this->settingsFile = $file;
        $this->basedir      = dirname(__FILE__) . '/../..';
        $this->initSettings();
        $this->initLocale();
        $this->initReplacements();
        $this->initInstances();
    }

    private function initSettings($force = false) {
        if (!$force && is_array($this->settings)) return;

        if ($this->settingsFile === false) $this->settingsFile = $this->basedir . '/conf/settings.ini';
        if (!$this->settings = parse_ini_file($this->settingsFile, true)) throw new exception('Unable to open ' .
                                                                                              $this->settingsFile . '.'
        );

        if (strncmp($this->settings ['general'] ['baseurl'], '/', strlen($this->settings ['general'] ['baseurl'])) ===
            0) {
            $this->settings ['general'] ['baseurl'] = substr($this->settings ['general'] ['baseurl'], 1);
        }
    }

    private function initLocale() {

        $defLangFile = $this->basedir . '/locale/locale.properties';
        $lang        = $this->settings['general']['lang'];
        $langFile    = $this->basedir . '/locale/locale_' . $lang . '.properties';
        if (file_exists($langFile)) {
            $this->locale = parse_ini_file($langFile);
        }
        else {
            $this->locale = parse_ini_file($defLangFile);
        }

    }

    private function initReplacements($force = false) {
        if (!$force && is_array($this->replacements)) return;

        if ($this->replacementFile === false) $this->replacementFile = $this->basedir . '/conf/replace_strings.txt';
        $lines = file($this->replacementFile);
        if ($lines === false) throw new exception('Unable to open ' . $this->replacementFile . '.');

        foreach ($lines as $line) {
            if (substr(trim($line), 0, 1) === "#") continue;
            $line  = str_replace(array("\r", "\n", "\r\n"), "", $line);
            $entry = explode("=", $line, 2);
            if (sizeof($entry) < 2) $entry[1] = '';
            $this->replacements [$entry [0]] = $entry [1];
        }
    }

    private function initInstances() {

        $this->lfmapi = new LastFm ();
        $this->lfmapi->setApiKey($this->settings ['lastfm'] ['apikey']);
        $this->ytapi = new YoutubeSearch ();
        if (isset ($this->settings ['youtube'] ['email']))
            $this->ytapi->setAPIEmail($this->settings ['youtube'] ['email']);
        if (isset ($this->settings ['youtube'] ['jsonfile']))
            $this->ytapi->setAPIJson($this->settings ['youtube'] ['jsonfile']);
        if (isset ($this->settings ['youtube'] ['user']))
            $this->ytapi->setAPIUser($this->settings ['youtube'] ['user']);
        $this->ytapi->setAPIKey($this->settings ['youtube'] ['apikey']);
    }

    public static function startsWith($haystack, $needle) {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }

    public static function getRemoteFile($url) {
        $ch      = curl_init();
        $timeout = 5;

        curl_setopt($ch, CURLOPT_URL, $url);
        //curl_setopt($ch, CURLOPT_HTTPGET, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        //curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
        //curl_setopt($ch, CURLOPT_PIPEWAIT, true);
        curl_setopt($ch, CURLOPT_USERAGENT,
                    'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
        );
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);


        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

    public static function endsWith($haystack, $needle) {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }
        return (substr($haystack, -$length) === $needle);
    }

    /**
     * @return LastFm
     */
    public function getLfmApi() {
        return $this->lfmapi;
    }

    /**
     * @return YoutubeSearch
     */
    public function getYtApi() {
        return $this->ytapi;
    }

    /**
     * @return mixed
     */
    public function getSettings() {
        return $this->settings;
    }

    public function getLocale() {
        return $this->locale;
    }

    public function startSession() {
        $started = false;
        if (php_sapi_name() !== 'cli') {
            if (version_compare(phpversion(), '5.4.0', '>=')) $started = session_status() ===
                                                                         PHP_SESSION_ACTIVE ? true : false;
            else  $started = session_id() === '' ? false : true;
        }
        if (!$started) session_start();
        $getuser = isset($_GET['lastfm_user']) ?
            filter_var($_GET['lastfm_user'], FILTER_SANITIZE_STRING) : null;
        if ($getuser != null && strlen(trim($getuser)) > 0) {
            $_SESSION ['music'] ['lastfm_user'] = $getuser;
            unset ($_GET ['lastfm_user']);
        }
        else if (!isset ($_SESSION ['music'] ['lastfm_user'])) {
            $_SESSION ['music'] ['lastfm_user'] = self::$instance->settings ['general'] ['lastfm_defaultuser'];
        }
        $_SESSION ['music'] ['lastfm_user'] = trim($_SESSION ['music'] ['lastfm_user']);

        self::$instance->lfmapi->setUser($_SESSION ['music'] ['lastfm_user']);
    }

    public function logMessage($msg) {
        self::$instance->initSettings();
        $logfile = fopen(self::getInstance()->settings['general']['logpath'], 'a+');

        $prefix = date('d.m.Y H:i:s');
        if (is_array($msg)) {
            foreach ($msg as $item) {
                $msgArr = explode("\n", self::br2nl($item));
                for ($i = 0; $i < sizeof($msgArr); $i++) {
                    if (strlen($msgArr[$i]) > 0) fwrite($logfile, $prefix . "\t" . $msgArr[$i] . "\r\n");
                }
            }
        }
        else {
            $msgArr = explode("\n", self::br2nl($msg));
            for ($i = 0; $i < sizeof($msgArr); $i++) {
                if (strlen($msgArr[$i]) > 0) fwrite($logfile, $prefix . "\t" . $msgArr[$i] . "\r\n");
            }
        }

        fclose($logfile);
    }

    public static function getInstance() {
        if (is_null(self::$instance)) {
            self::$instance = new Functions();
        }
        return self::$instance;
    }

    public static function br2nl($text, $tags = "br") {
        $tags = explode(" ", $tags);

        foreach ($tags as $tag) {
            $text = preg_replace("/<" . $tag . "[^>]*>/i", "\n", $text);
            $text = preg_replace("/<\/" . $tag . "[^>]*>/i", "\n", $text);
        }

        return ($text);
    }

    public function prepareNeedle($needle) {
        self::getInstance()->initReplacements();
        $needle = $this->decodeHTML($needle);
        if (is_array($this->replacements)) {
            foreach ($this->replacements as $key => $value) {
                $needle = str_replace($key, $value, $needle);
            }
        }
        return $needle;
    }

    public function decodeHTML($val) {
        return html_entity_decode(strip_tags($val), ENT_QUOTES | ENT_HTML5);
    }

    public function encodeHTML($val) {
        return filter_var($val, FILTER_SANITIZE_FULL_SPECIAL_CHARS, ENT_QUOTES | ENT_HTML5);
    }

    public function saveConfig($config = false) {

        $fh = fopen(dirname(__FILE__) . '/../../conf/settings.ini', 'w');
        fwrite($fh, "; you need to have a registered last.fm user with a developer API\n\n" . "['general']\n" .
                    "baseurl = " . $config['general']['baseurl'] . "\n" . "; possible values = de,en\n" . "lang = " .
                    $config['general']['lang'] . "\n" . ";path to log file\n" . "logpath = " .
                    $config['general']['logpath'] . "\n" . ";youtube player width and height (relative or absolte)\n" .
                    "playerwidth = " . $config['general']['playerwidth'] . "\n" . "playerheight = " .
                    $config['general']['playerheight'] . "\n" .
                    "; themes/mytheme must exist, possible values 'default','dark'\n" . "theme = " .
                    $config['general']['theme'] . "\n" .
                    ";Conext Menu Theme name. Included themes are: 'default','xp','vista','osx','human','gloss'\n" .
                    ";Multiple themes may be applied with a comma-separated list.\n" . "cmenutheme = " .
                    $config['general']['cmenutheme'] . "\n" .
                    "; the default last.fm user when initally loading the playlist\n" . "lastfm_defaultuser = " .
                    $config['general']['lastfm_defaultuser'] . "\n" .
                    "; the Admin Password as sha1_value (default is lfmtube)\n" . "adminpw = " .
                    $config['general']['adminpw'] . "\n" . ";[database]\n" .
                    ";dsn = mysql:host=127.0.0.1;port=3306;dbname=lasttube;charset=UTF8;\n" .
                    ";table_prefix = music_\n" . ";username = lastuser\n" . ";password = l4stp4$$\n" . "\n" .
                    "[database]\n" . "dsn = " . $config['database']['dsn'] . "\n" . "table_prefix = " .
                    $config['database']['table_prefix'] . "\n" . "username = " . $config['database']['username'] .
                    "\n" . "password = " . $config['database']['password'] . "\n" . "\n" . "[lastfm]\n" .
                    "; the lastfm user with the developer API Key\n" . "user = " . $config['lastfm']['user'] . "\n" .
                    "; the lastfm user developer API Key\n" . "apikey = " . $config['lastfm']['apikey'] . "\n" . "\n" .
                    "[youtube]\n" . "apikey = " . $config['youtube']['apikey'] . "\n" .
                    "; required for OAuth Login (not yet supported)\n" .
                    ";email = 755183333407-8a5huo8gk68uenschgvg1vpmdbj9c18r@developer.gserviceaccount.com\n" .
                    ";keyfile = /home/ravermeister/lastfm.rimkus.it/conf/youtube.p12\n" . ";user = info@rimkus.it\n"
        );
        fclose($fh);
        self::getInstance()->initSettings(true);
    }

    public function requestVars($type = 'GET') {
        switch ($type) {
            case 'GET':
                $getvars = array();
                foreach ($_GET as $key => $value) {
                    $getvars[$key] = strip_tags($value);
                }
                return $getvars;

            case 'POST':
                $postvars = array();
                foreach ($_POST as $key => $value) {
                    $postvars[$key] = strip_tags($value);
                }
                return $postvars;

            case 'PUT':
                $rawData = file_get_contents('php://input');
                return json_decode($rawData, true);
                break;

        }
    }
}
