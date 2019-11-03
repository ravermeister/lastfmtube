<?php
namespace LastFmTube\Util;

/**
 * Merge Theme Tempplates together.
 * 
 * @author Jonny Rimkus<jonny@rimkus.it>
 * 
 */
class ThemeHandler {

     private $themes = array();

     private $locale = null;

     public function __construct($name, $file) {
          $this->locale = Functions::getInstance()->getLocale();
          $themeData = $this->parseTheme($name, $file);
          $this->themes[$name] = $themeData;          
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
          return $themeData;
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
          $templateFile = $themeDir . '/' . $templateFile;
          $templateData = file_get_contents($templateFile);
          while (($newData = $this->searchNestedThemes(dirname($templateFile), $templateData)) !== false) {
               $themeData = $newData;
          }

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

