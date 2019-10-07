<?php
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

     public function printHelp() {
          echo "Usage:\n " . "-generateSiteMap <outfile> - create Sitemap.xml\n";
     }
}


$control = new AdminControl();
$control->printHelp();

exit(0);