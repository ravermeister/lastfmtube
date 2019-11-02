<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Util;

use DomainException;
use InvalidArgumentException;
use LastFmTube\Api\LastFm\LastFm;
use LastFmTube\Api\YouTube\YouTubeSearch;
use DateTime;
use Exception;
use Locale;

class Functions {

     private static $instance;

     private $basedir = false;

     private $settings = false;

     private $settingsFile = false;

    /**
     * @var LastFm
     */
     private $lfmapi = null;

     private $ytapi = null;

     private $localeMap = null;

     private $logFile = null;

     /**
      *
      * @var SiteMap
      */
     private $sitemap = null;

     private function __construct($file = false) {
          $this->settingsFile = $file;
          $this->basedir = dirname(__FILE__) . '/../..';
         try {
             $this->initSettings();
             $this->initLogFile();
             $this->initLocale();
             $this->initInstances();
             $this->initSiteMapGenerator();
         } catch (Exception $e) {
             //$e->getMessage();
         }

     }

    /**
     * @throws Exception
     */
     private function initSiteMapGenerator() {
          $this->sitemap = new SiteMap($this->settings['general']['domain'], $this->settings['general']['sitemap_file']);
          $this->sitemap->addURL('/lastfm')
               ->addURL('/topsongs')
               ->addURL('/personal')
               ->addURL('/users')
               ->addURL('/video');
     }

    /**
     * @param bool $force
     * @throws Exception
     */
     private function initSettings($force = false) {
          if (! $force && is_array($this->settings)) return;

          if ($this->settingsFile === false) $this->settingsFile = $this->basedir . '/conf/settings.json';
          $this->settings = json_decode(file_get_contents($this->settingsFile), true);
          if (! $this->settings || $this->settings === null) {
               throw new exception('Unable to open ' . $this->settingsFile . '.');
          }

          $this->settings['general']['logfile'] = self::normalizePath($this->basedir, $this->settings['general']['logfile']);
          $this->settings['database']['dbinit_file'] = self::normalizePath($this->basedir, $this->settings['database']['dbinit_file']);
          $this->settings['general']['lang'] = 'en';
     }

    /**
     * @param $artist
     * @param $title
     * @throws Exception
     */
     public static function normalizeTrack(&$artist, &$title) {
          $replacements = Db::getInstance()->getReplaceTrackMap();

          // self::getInstance()->logMessage('before function normalize, artist: >'.$artist.'<, title: >'.$title.'<');

          foreach ($replacements as $row) {
               $orig_artist_expr = '/' . $row['orig_artist_expr'] . '/';
               $orig_title_expr = '/' . $row['orig_title_expr'] . '/';

               $artist = trim($artist);
               $title = trim($title);

               $orig_artist = $artist;
               $orig_title = $title;

               if (preg_match($orig_artist_expr, $orig_artist) === 1 && preg_match($orig_title_expr, $orig_title) === 1) {

                    $repl_artist = str_replace(Db::$ARTIST_REGEX, '$', $row['repl_artist']);
                    $repl_artist = preg_replace($orig_artist_expr, $repl_artist, $orig_artist);
                    // self::getInstance()->logMessage('artist>artist replacement: '.$repl_artist);
                    // artist with artist regex replaced

                    $repl_title = str_replace(Db::$TITLE_REGEX, '$', $row['repl_title']);
                    $repl_title = preg_replace($orig_title_expr, $repl_title, $orig_title);
                    // self::getInstance()->logMessage('title>title replacement: '.$repl_title);
                    // title with title regex replaced

                    $repl_artist = str_replace(Db::$TITLE_REGEX, '$', $repl_artist);
                    $repl_artist = preg_replace($orig_title_expr, $repl_artist, $orig_title);
                    // self::getInstance()->logMessage('artist>title replacement: '.$repl_artist);
                    // artist with title replaced

                    $repl_title = str_replace(Db::$ARTIST_REGEX, '$', $repl_title);
                    $repl_title = preg_replace($orig_artist_expr, $repl_title, $orig_artist);
                    // self::getInstance()->logMessage('title>artist replacement: '.$repl_title);
                    // title with artist replaced

                    $artist = $repl_artist;
                    $title = $repl_title;

                    // stop prcessing when pattern matched
                    break;
               }
          }

          // self::getInstance()->logMessage('after function normalize, artist: >'.$artist.'<, title: >'.$title.'<');
     }

     private static function normalizePath($basedir, $path) {
          if (! self::isAbsolutePath($path)) {
               return $basedir . '/' . $path;
          }
          return $path;
     }

     private static function isAbsolutePath($path) {
          if (! is_string($path)) {
               $mess = sprintf('String expected but was given %s', gettype($path));
               throw new InvalidArgumentException($mess);
          }
          if (! ctype_print($path)) {
               $mess = 'Path can NOT have non-printable characters or be empty';
               throw new DomainException($mess);
          }
          // Optional wrapper(s).
          $regExp = '%^(?<wrappers>(?:[[:print:]]{2,}://)*)';
          // Optional root prefix.
          $regExp .= '(?<root>(?:[[:alpha:]]:/|/)?)';
          // Actual path.
          $regExp .= '(?<path>(?:[[:print:]]*))$%';
          $parts = [];
          if (! preg_match($regExp, $path, $parts)) {
               $mess = sprintf('Path is NOT valid, was given %s', $path);
               throw new DomainException($mess);
          }
          if ('' !== $parts['root']) {
               return true;
          }
          return false;
     }

     private function initLogFile() {
          $this->logFile = fopen($this->settings['general']['logfile'], 'a+');
     }

     private function initLocale() {
          $this->localeMap['en'] = json_decode(file_get_contents($this->basedir . '/locale/locale.json'), true);
          $this->localeMap['en']['code'] = 'en';

          foreach (glob($this->basedir . '/locale/locale_??.json', GLOB_MARK) as $lang) {
               if (Strings::endsWith($lang, '/')) continue; // dir

               $ldef = explode('_', $lang)[1];
               $ldef = explode('.', $ldef)[0];

               $this->localeMap[$ldef] = json_decode(file_get_contents($lang), true);
               $this->localeMap[$ldef]['code'] = $ldef;
          }
     }

     private function initInstances() {
          $this->lfmapi = new LastFm();
          $this->lfmapi->setApiKey($this->settings['api']['lastfm']['key']);
          $this->ytapi = new YouTubeSearch();
          if (isset($this->settings['api']['youtube']['email'])) $this->ytapi->setAPIEmail($this->settings['youtube']['email']);
          if (isset($this->settings['api']['youtube']['jsonfile'])) $this->ytapi->setAPIJson($this->settings['youtube']['jsonfile']);
          if (isset($this->settings['api']['youtube']['user'])) $this->ytapi->setAPIUser($this->settings['youtube']['user']);
          $this->ytapi->setAPIKey($this->settings['api']['youtube']['key']);
     }

     public static function startsWith($haystack, $needle) {
          $length = strlen($needle);
          return (substr($haystack, 0, $length) === $needle);
     }

     public static function getRemoteFile($url) {
          $ch = curl_init();
          $timeout = 5;

          curl_setopt($ch, CURLOPT_URL, $url);
          // curl_setopt($ch, CURLOPT_HTTPGET, $url);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
          curl_setopt($ch, CURLOPT_AUTOREFERER, true);
          curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
          // curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
          // curl_setopt($ch, CURLOPT_PIPEWAIT, true);
          curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
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
          return (substr($haystack, - $length) === $needle);
     }

     public static function getInstance() {
          if (is_null(self::$instance)) {
               self::$instance = new Functions();
          }
          return self::$instance;
     }

     public function formatDate($date, $srcFormat = 'Y-m-d H:i:s') {
          if (strlen(trim($date)) <= 0) return $date;

          $newFormat = 'Y-m-d H:i:s';
          $lang = $this->getSettings()['general']['lang'];
          if (strcmp($lang, 'de') == 0) {
               $newFormat = 'd.m.Y H:i:s';
          }
          if (strcmp($srcFormat, $newFormat) == 0) return $date;

          return DateTime::createFromFormat($srcFormat, $date)->format($newFormat);
     }

     /**
      *
      * @return mixed
      */
     public function getSettings() {
          return $this->settings;
     }

     /**
      *
      * @return LastFm
      */
     public function getLfmApi() {
          return $this->lfmapi;
     }

     /**
      *
      * @return YouTubeSearch
      */
     public function getYtApi() {
          return $this->ytapi;
     }

     public function getLocale($lang = 'en') {
          $requestLang = '';
          if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
               $requestLang = Locale::acceptFromHttp($_SERVER['HTTP_ACCEPT_LANGUAGE']);
               $requestLang = explode('_', $requestLang)[0];
          }
          return isset($this->localeMap[$requestLang]) ? $this->localeMap[$requestLang] : $this->localeMap[$lang];
     }

     public function logMessage($msg) {
          if ($this->logFile === null || $this->logFile === false) return;

          $prefix = date('d.m.Y H:i:s');
          if (is_array($msg)) {
               foreach ($msg as $item) {
                    $item = self::br2nl($item);
                    if (is_array($item)) {
                        $this->logMessage($item);
                        continue;
                    }

                    $msgArr = explode("\n", $item);
                    if ($msgArr === false || sizeof($msgArr) == 1) {
                         if (strlen($msgArr) > 0) fwrite($this->logFile, $prefix . "\t" . $msgArr . "\r\n");
                         continue;
                    }

                    for ($i = 0; $i < sizeof($msgArr); $i ++) {
                         if (strlen($msgArr[$i]) > 0) fwrite($this->logFile, $prefix . "\t" . $msgArr[$i] . "\r\n");
                    }
               }
          } else {
               $msgArr = explode("\n", self::br2nl($msg));
               for ($i = 0; $i < sizeof($msgArr); $i ++) {
                    if (strlen($msgArr[$i]) > 0) fwrite($this->logFile, $prefix . "\t" . $msgArr[$i] . "\r\n");
               }
          }

          fflush($this->logFile);
     }

     public static function br2nl($text, $tags = "br") {
          $tags = explode(" ", $tags);

          foreach ($tags as $tag) {
               $text = preg_replace("/<" . $tag . "[^>]*>/i", "\n", $text);
               $text = preg_replace("/<\/" . $tag . "[^>]*>/i", "\n", $text);
          }

          return ($text);
     }

     public function startSession() {
          $started = false;
          if (php_sapi_name() !== 'cli') {
               if (version_compare(phpversion(), '5.4.0', '>=')) $started = session_status() === PHP_SESSION_ACTIVE ? true : false;
               else $started = session_id() === '' ? false : true;
          }
          if (! $started) session_start();
          $getuser = isset($_GET['lastfm_user']) ? filter_var($_GET['lastfm_user'], FILTER_SANITIZE_STRING) : null;
          if ($getuser != null && strlen(trim($getuser)) > 0) {
               $_SESSION['music']['lastfm_user'] = $getuser;
               unset($_GET['lastfm_user']);
          } else if (! isset($_SESSION['music']['lastfm_user'])) {
               $_SESSION['music']['lastfm_user'] = $this->settings['general']['lastfm_defaultuser'];
          }
          $_SESSION['music']['lastfm_user'] = trim($_SESSION['music']['lastfm_user']);

          $this->lfmapi->setUser($_SESSION['music']['lastfm_user']);
     }

     public function __destruct() {
          fflush($this->logFile);
          fclose($this->logFile);
     }

     public function decodeHTML($val) {
          return html_entity_decode(strip_tags($val), ENT_QUOTES | ENT_HTML5);
     }

     public function encodeHTML($val) {
          return filter_var($val, FILTER_SANITIZE_FULL_SPECIAL_CHARS, ENT_QUOTES | ENT_HTML5);
     }

    /**
     * @param bool $config
     * @throws Exception
     */
     public function saveConfig($config = false) {
          $fh = fopen(dirname(__FILE__) . '/../../conf/settings.ini', 'w');
          fwrite($fh, "; you need to have a registered last.fm user with a developer API\n\n" . "['general']\n" . "baseurl = " . $config['general']['baseurl'] . "\n" . "; possible values = de,en\n" . "lang = " . $config['general']['lang'] . "\n" . ";path to log file\n" . "logpath = " . $config['general']['logpath'] . "\n" . ";youtube player width and height (relative or absolte)\n" . "playerwidth = " . $config['general']['playerwidth'] . "\n" . "playerheight = " . $config['general']['playerheight'] . "\n" . "; themes/mytheme must exist, possible values 'default','dark'\n" . "theme = " . $config['general']['theme'] . "\n" . ";Conext Menu Theme name. Included themes are: 'default','xp','vista','osx','human','gloss'\n" . ";Multiple themes may be applied with a comma-separated list.\n" . "cmenutheme = " . $config['general']['cmenutheme'] . "\n" . "; the default last.fm user when initally loading the playlist\n" . "lastfm_defaultuser = " . $config['general']['lastfm_defaultuser'] . "\n" . "; the Admin Password as sha1_value (default is lfmtube)\n" . "adminpw = " . $config['general']['adminpw'] . "\n" . ";[database]\n" . ";dsn = mysql:host=127.0.0.1;port=3306;dbname=lasttube;charset=UTF8;\n" . ";username = lastuser\n" . ";password = l4stp4$$\n" . "\n" . "[database]\n" . "dsn = " . $config['database']['dsn'] . "\n" . "username = " . $config['database']['username'] . "\n" . "password = " . $config['database']['password'] . "\n" . "\n" . "[lastfm]\n" . "; the lastfm user with the developer API Key\n" . "user = " . $config['lastfm']['user'] . "\n" . "; the lastfm user developer API Key\n" . "apikey = " . $config['lastfm']['apikey'] . "\n" . "\n" . "[youtube]\n" . "apikey = " . $config['youtube']['apikey'] . "\n" . "; required for OAuth Login (not yet supported)\n" . ";email = 755183333407-8a5huo8gk68uenschgvg1vpmdbj9c18r@developer.gserviceaccount.com\n" . ";keyfile = /home/ravermeister/lastfm.rimkus.it/conf/youtube.p12\n" . ";user = info@rimkus.it\n");
          fclose($fh);
          $this->initSettings(true);
     }

     public function sortTracksByDate(&$tracks, $offset = 0, $asc = false) {
         if ($asc) {
               $sorted = usort($tracks, function ($trackA, $trackB) {
                    return self::sortArrayByDateAsc($trackA, $trackB);
               });
          } else {
               $sorted = usort($tracks, function ($trackA, $trackB) {
                    return self::sortArrayByDateDesc($trackA, $trackB);
               });
          }

          for ($cnt = 0; $cnt < sizeof($tracks); $cnt ++) {
               $tracks[$cnt]['NR'] = $offset + ($cnt + 1);
          }
          return $sorted;
     }

     public function sortTracksByPlayCount(&$tracks, $offset = 0, $asc = false) {
         if ($asc === true) {
               $sorted = usort($tracks, function ($trackA, $trackB) {
                    return self::sortArrayByPlayCountAsc($trackA, $trackB);
               });
          } else {
               $sorted = usort($tracks, function ($trackA, $trackB) {
                    return self::sortArrayByPlayCountDesc($trackA, $trackB);
               });
          }

          for ($cnt = 0; $cnt < sizeof($tracks); $cnt ++) {
               $tracks[$cnt]['NR'] = $offset + ($cnt + 1);
          }
          return $sorted;
     }

    /**
     * @param $trackA
     * @param $trackB
     * @return float|int
     * @throws Exception
     */
     private static function sortArrayByPlayCountDesc($trackA, $trackB) {
          return self::sortArrayByPlayCountAsc($trackA, $trackB) * - 1;
     }

    /**
     * @param $trackA
     * @param $trackB
     * @return int
     * @throws Exception
     */
     private static function sortArrayByPlayCountAsc($trackA, $trackB) {
          $aCnt = isset($trackA['PLAYCOUNT']) ? $trackA['PLAYCOUNT'] : 0;
          $bCnt = isset($trackB['PLAYCOUNT']) ? $trackB['PLAYCOUNT'] : 0;
          $cmpVal = (($aCnt > $bCnt) ? 1 : (($aCnt < $bCnt) ? - 1 : 0));
          if ($cmpVal == 0) {
               $cmpVal = self::sortArrayByDateAsc($trackA, $trackB);
          }
          return $cmpVal;
     }

    /**
     * @param $trackA
     * @param $trackB
     * @return float|int
     * @throws Exception
     */
     private static function sortArrayByDateDesc($trackA, $trackB) {
          return self::sortArrayByDateAsc($trackA, $trackB) * - 1;
     }

    /**
     * @param $trackA
     * @param $trackB
     * @return int
     * @throws Exception
     */
     private static function sortArrayByDateAsc($trackA, $trackB) {
          $aDate = isset($trackA['LASTPLAY']) ? new DateTime($trackA['LASTPLAY']) : new DateTime('1970-01-01 00:00:00');
          $bDate = isset($trackB['LASTPLAY']) ? new DateTime($trackB['LASTPLAY']) : new DateTime('1970-01-01 00:00:00');
          $cmpVal = (($aDate > $bDate) ? 1 : (($aDate < $bDate) ? - 1 : 0));
          if ($cmpVal == 0) {
               $cmpVal = self::sortArrayByPlayCountAsc($trackA, $trackB);
          }
          return $cmpVal;
     }
}
