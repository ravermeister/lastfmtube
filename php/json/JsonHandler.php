<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:07
 */

namespace LastFmTube\json;

use LastFmTube\Util\Functions;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

static $RESERVED_ARGS = array('api');


if (!isset($_GET['api']) || strlen($_GET['api']) == 0) {
    DefaultJson::baseError('Falsche Parameter angabe!');
    return;
}

$json = null;
switch ($_GET['api']) {
    case 'charts' :
        $json = new ChartsJson();
        break;
    case 'lastfm':
        $json = new LastFmJson();
        break;
    case 'page':
        $json = new PageJson();
        break;
    case 'vars':
        $json = new EnvVarsJson();
        break;
    case 'videos':
        $json = new YouTubeJson();
        break;
    default:
        DefaultJson::baseError('unbekannter Api Endpunkt: ' . $_GET['api']);
        break;

}

$getvars = Functions::getInstance()->requestVars('GET');
$output  = '';
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $json->setMethod('GET');
        $output = $json->get($getvars);
        break;

    case 'POST':
        $json->setMethod('PUT');
        $postvars = Functions::getInstance()->requestVars('POST');
        $output   = $json->post($getvars, $postvars);
        break;

    case 'PUT':
        $json->setMethod('PUT');
        $postvars = Functions::getInstance()->requestVars('PUT');
        $output   = $json->put($getvars, $postvars);
        break;

    case 'DELETE':
        $json->setMethod('DELETE');
        $output = $json->delete($getvars);
        break;

    default:
        $output = $json->jsonError('unbekannte Action:' . $_SERVER['REQUEST_METHOD']);
        break;
}

header('Content-Type: application/json');
die($output);