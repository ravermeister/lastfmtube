<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Util;

/**
 * Merge Theme Tempplates together.
 *
 * @author Jonny Rimkus<jonny@rimkus.it>
 *        
 */
class ThemeHandler {

     private $cacheDir = null;

     public function __construct($cacheDir = null) {
          $this->cacheDir = $cacheDir;
     }

     public function getTheme($file) {
          $themeData = $this->readFromCache($file);          
          if ($themeData !== false) {
               return $themeData;
          }

          $themeData = file_get_contents($file);
          while (($newData = $this->searchNestedThemes(dirname($file), $themeData)) !== false) {
               $themeData = $newData;
          }

          $themeData = $this->replaceVars($themeData);
          $this->saveToCache($file, $themeData);

          return $themeData;
     }

     private function readFromCache($file) {
          if ($this->cacheDir === null) return false;

          $hash = sha1_file($file);
          $absCacheDir = dirname(__FILE__) . '/../../' . $this->cacheDir;
          $cacheFile = $absCacheDir . '/' . $hash;
          return file_get_contents($cacheFile);
     }

     private function saveToCache($file, $data) {
          if ($this->cacheDir === null) {
               return true;
          }

          $absCacheDir = dirname(__FILE__) . '/../../' . $this->cacheDir;
          $hash = sha1_file($file);
          $cacheFile = $absCacheDir . '/' . $hash;
          $result = file_put_contents($cacheFile, $data);
          return $result !== false;
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
               $templateData = $newData;
          }

          $tplEndPos += strlen('{{/TEMPLATE}}');
          return substr_replace($themeData, $templateData, $tplStartPos, ($tplEndPos - $tplStartPos));
     }

     private function replaceVars($themeData) {
          $locale = Functions::getInstance()->getLocale();
          $themeData = str_replace('{{PHP_LANG}}', $locale['code'], $themeData);
          $themeData = str_replace('{{PHP_TITLE}}', $locale['site']['title'], $themeData);
          $themeData = str_replace('{{PHP_HEADER}}', $locale['site']['header'], $themeData);
          return $themeData;
     }
}

