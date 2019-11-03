<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
require_once 'vendor/autoload.php';

use LastFmTube\Util\Functions;
use LastFmTube\Util\ThemeHandler;

$settings = Functions::getInstance()->getSettings();
$themeName = $settings['general']['theme'];
$themeFile = 'themes/' . $themeName . '/' . $themeName . '.html';
// unused
// $baseURL = $settings ['general'] ['baseurl'];

// prepare theme
$theme = new ThemeHandler($settings['general']['tmpdir']);

// header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
// header("Pragma: no-cache"); // HTTP 1.0.
// header("Expires: 0"); // Proxies.

header("Content-Type: text/html"); // html content

Functions::getInstance()->startSession();
// Functions::getInstance()->logMessage('SQLite Version: '.\LastFmTube\Util\Db::getVersion());

die($theme->getTheme($themeFile));