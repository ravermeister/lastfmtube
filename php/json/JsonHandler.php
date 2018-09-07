<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:07
 */

namespace LastFmTube\json;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

static $METHODS = array('get', 'getAll', 'put', 'putAll', 'update', 'updateAll', 'delete', 'deleteAll');
static $RESERVED_ARGS = array('method', 'api');


if (!isset($_GET['method']) || strlen($_GET['method']) == 0 || !isset($_GET['api']) || strlen($_GET['api']) == 0 ||
    !in_array($_GET['method'], $METHODS)) {
    DefaultJson::baseError('Falsche Parameter angabe!');
    return;
}

$json = null;
switch ($_GET['api']) {
    case 'charts' :
        $json = new ChartsJson();
        break;
    default:
        DefaultJson::baseError('unbekannter Api Endpunkt');
        break;

}

$getvars = array();
$postvars = array();

foreach ($_GET as $key => $value) {
    if (in_array($key, $RESERVED_ARGS)) continue;
    $getvars[$key] = strip_tags($value);
}
foreach ($_POST as $key => $value) {
    $postvars[$key] = strip_tags($value);
}

$output = '';
switch ($_GET['method']) {
    case 'get':
        $json->setMethod('get');
        $output = $json->get($getvars, $postvars);
        break;

    case 'getAll':
        $json->setMethod('getAll');
        $output = $json->getAll($getvars, $postvars);
        break;

    case 'put':
        $json->setMethod('put');
        $output = $json->put($getvars, $postvars);
        break;

    case 'putAll':
        $json->setMethod('putAll');
        $output = $json->putAll($getvars, $postvars);
        break;

    case 'update':
        $json->setMethod('update');
        $output = $json->update($getvars, $postvars);
        break;

    case 'updateAll':
        $json->setMethod('updateAll');
        $output = $json->updateAll($getvars, $postvars);
        break;

    case 'delete':
        $json->setMethod('delete');
        $output = $json->deleteAll($getvars, $postvars);
        break;

    case 'deleteAll':
        $json->setMethod('deleteAll');
        $output = $json->deleteAll($getvars, $postvars);
        break;

    default:
        $output = $json->jsonError('unbekannte Action');
        break;
}

header('Content-Type: application/json');
die($output);