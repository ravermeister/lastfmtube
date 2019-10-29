<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Util;

class Strings {

     public static function startsWith($haystack, $needle) {
          $length = strlen($needle);
          return (substr($haystack, 0, $length) === $needle);
     }

     public static function endsWith($haystack, $needle) {
          $length = strlen($needle);
          if ($length == 0) {
               return true;
          }

          return (substr($haystack, - $length) === $needle);
     }

     public static function trimEOL($string) {
          $string = str_replace("\t", '', $string); // remove tabs
          $string = str_replace("\n", '', $string); // remove new lines
          $string = str_replace("\r", '', $string); // remove carriage returns
          return $string;
     }
}