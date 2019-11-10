<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;
use LastFmTube\Util\SiteMap;
use LastFmTube\Util\Strings;

require 'vendor/autoload.php';

class AdminControl {

     private function hasArg($arg) {
          global $argv;
          for ($cnt = 0; $cnt < sizeof($argv); $cnt ++) {
               if (strcmp($argv[$cnt], $arg) === 0) {
                    return true;
               }
          }

          return false;
     }

     private function argVal($arg) {
          global $argv;
          for ($cnt = 0; $cnt < sizeof($argv); $cnt ++) {
               if (Strings::startsWith($argv[$cnt], $arg)) {
                    return substr($argv[$cnt], strlen($arg));
               }
          }

          return null;
     }

     private function generateSiteMap($outfile) {
          echo 'generating sitemap...';
          try {
               $sitemap = new SiteMap('https://lastfm.rimkus.it', $outfile);
               $sitemap->addURL('/topsongs');
               $sitemap->addURL('/lastfm');
               $sitemap->addURL('/users');
               $sitemap->addURL('/video');
               $sitemap->addURL('/personal');
               $sitemap->create(true);
          } catch (Exception $err) {
               Functions::getInstance()->logMessage('Error: ' . $err->getMessage());
          }

          echo "finished\n";
     }

     /**
      *
      * @param
      *             $csvGlob
      * @throws Exception
      */
     private function initReplacements($csvGlob) {
          $csvFiles = glob($csvGlob);
          echo 'initalize Database connection...';
          $db = Db::getInstance();
          echo " done\n";
          foreach ($csvFiles as $csvFile) {
               if (! file_exists($csvFile)) continue;
               echo "Importing Replacement CSV >$csvFile<...";
               $result = $db->importReplacementCSV($csvFile);
               if ($result === false) {
                    echo " error\n";
               } else if ($result < 0) {
                    echo " not changed\n";
               } else {
                    echo ($result == 1 ? " $result row " : "$result rows ") . "imported\n";
               }
          }
          echo 'reload replacement map...';
          $db->getReplaceTrackMap(true);
          echo " done\n";
     }

     /*
      * php delete function that deals with directories recursively
      */
     private function deleteFiles($target) {
          if (is_dir($target)) {

               $files = glob($target . '*', GLOB_MARK); // GLOB_MARK adds a slash to directories returned

               foreach ($files as $file) {
                    $this->deleteFiles($file);
               }

               if (is_dir($target)) {
                    rmdir($target);
               } else if (is_file($target)) {
                    unlink($target);
               }
          } elseif (is_file($target)) {
               unlink($target);
          }
     }

     private function clearTempFiles() {
          $settings = Functions::getInstance()->getSettings();
          $tmpdir = dirname(__FILE__) . '/' . $settings['general']['tmpdir'];
          echo 'clearing temp directory >' . $tmpdir . '< ...';
          if (is_dir($tmpdir)) {
               $this->deleteFiles($tmpdir);
               if (! is_dir($tmpdir)) {
                    mkdir($tmpdir, 0777, true);
               }
          }
          echo "Done\n";
     }

     public function printHelp() {
          //@formatter:off
          echo "\n==========\n" .
               "Usage:\n" . 
               "-generateSiteMap file=sitemap.xml ===> create Sitemap.xml\n" . 
               "-importReplacements glob=/path/*/to/*.csv ===> import replacements from csv files\n" .
               "-cleanTempDir ===> clean Temporary files, such as generated templates etc.\n";
          // @formatter:on
     }

     /**
      *
      * @return int
      * @throws Exception
      */
     public function process() {
          if ($this->hasArg('-generateSiteMap')) {
               $outfile = $this->argVal('file=');
               if (is_null($outfile)) $outfile = 'sitemap.xml';
               $this->generateSiteMap($outfile);
               return 0;
          }

          if ($this->hasArg('-importReplacements')) {
               $csvGlob = $this->argVal('glob=');
               if (is_null($csvGlob)) {
                    $this->printHelp();
                    return 1;
               }

               $this->initReplacements($csvGlob);
               return 0;
          }

          if ($this->hasArg('-cleanTempDir')) {
               $this->clearTempFiles();
               return 0;
          }

          return 1;
     }
}

if (strcmp(php_sapi_name(), 'cli') !== 0) {
     die('Only cli mode is allowed!');
}

$control = new AdminControl();
try {
     $exitCode = $control->process();
} catch (Exception $e) {
     echo 'Error occured: ' . $e->getMessage();
     $exitCode = - 1;
}

if ($exitCode != 0) {
     $control->printHelp();
}
exit($exitCode);