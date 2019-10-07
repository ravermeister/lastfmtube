<?php
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

     private function generateSiteMap($outfile){
          echo 'generating sitemap...';
          
          $sitemap = new SiteMap('https://lastfm.rimkus.it', $outfile, 'sitemap-index.xml', true);
          $sitemap->addURL('/topsongs');
          $sitemap->addURL('/lastfm');
          $sitemap->addURL('/users');
          $sitemap->addURL('/videos');
          $sitemap->addURL('/personal');
          $sitemap->create(true);
          
          echo "finished\n";
     }
     
     public function printHelp() {
          echo "Usage:\n " . "-generateSiteMap file=sitemap.xml - create Sitemap.xml\n";
     }
    
     public function process() {
          if ($this->hasArg('-generateSiteMap')) {
               $outfile = $this->argVal('file=');
               if (is_null($outfile)) $outfile = 'sitemap.xml';
               $this->generateSiteMap($outfile);
               return 0;
          }

          return 1;
     }
}

$control = new AdminControl();
$exitCode = $control->process();
if ($exitCode != 0) {
     $control->printHelp();
}
exit($exitCode);