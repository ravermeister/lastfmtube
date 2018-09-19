<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 05:07
 */

namespace LastFmTube\json;

use LastFmTube\Util\Functions;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

class JsonHandler {
    private static $RESERVED_ARGS = array('api');
    private static $HANDLER_NAMES = array(
        'topuser',
        'topsongs',
        'lastfm',
        'search',
        'videos',
        'page',
        'vars'

    );
    
    
    private static function createHandler($api) {
        switch ($api) {
            case 'topuser':
            case 'topsongs':
            case 'lastfm':
            case 'page': return new PageJson();

            case 'vars': return new EnvVarsJson();

            case 'search':
            case 'videos': return new YouTubeJson();
        }

        return false;
    }   
    
    
    public static function handleRequest($returnOutput = false){
        header("Content-Type: application/json;charset=utf-8");

        if (!isset($_GET['api']) || strlen($_GET['api']) == 0 || !in_array($_GET['api'], JsonHandler::$HANDLER_NAMES, true)) {
            DefaultJson::baseError('Falsche Parameter angabe! ');
            return;
        }

        $json = JsonHandler::createHandler($_GET['api']);

        if (!isset($json) || $json === false) {
            DefaultJson::baseError('unbekannter Api Endpunkt: ' . $_GET['api']);
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
            
        if($returnOutput) return $output;
        die($output);        
    }
}

JsonHandler::handleRequest();

