<?php
namespace LastFmTube\Util;

class ThemeHandler {

     private $themes = array();

     private $locale = null;

     public function __construct($name, $file) {
          $this->locale = Functions::getInstance()->getLocale();
          $this->parseTheme($name, $file);
     }

     public function getTheme($name) {
          return $this->themes[$name];
     }

     private function parseTheme($name, $file) {
          $themeData = file_get_contents($file);
          while (($newData = $this->searchNestedThemes(dirname($file), $themeData)) !== false) {
               $themeData = $newData;
          }
          $themeData = $this->replaceVars($themeData);
          $this->themes[$name] = $themeData;
     }

     private function searchNestedThemes($themeDir, $themeData) {
          $tplStartPos = strpos($themeData, '{{TEMPLATE}}');
          if ($tplStartPos === false) {
               return false;
          }
          $tplEndPos = strpos($themeData, '{{/TEMPLATE}}', $tplStartPos);

          $fileStartPos = $tplStartPos + strlen('{{TEMPLATE}}');
          $fileEndPos = $tplEndPos - $fileStartPos;

          $templateFile = substr($themeData, $fileStartPos, $fileEndPos);
          $templateData = file_get_contents($themeDir . '/' . $templateFile);

          $tplEndPos += strlen('{{/TEMPLATE}}');
          return substr_replace($themeData, $templateData, $tplStartPos, ($tplEndPos - $tplStartPos));
     }

     private function replaceVars($themeData) {
          $themeData = str_replace('{{PHP_LANG}}', $this->locale['code'], $themeData);
          $themeData = str_replace('{{PHP_TITLE}}', $this->locale['site']['title'], $themeData);
          $themeData = str_replace('{{PHP_HEADER}}', $this->locale['site']['header'], $themeData);
          return $themeData;
     }
}

