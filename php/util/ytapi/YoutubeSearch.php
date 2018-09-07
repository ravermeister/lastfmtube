<?php

namespace LastFmTube\Util\ytapi;

use Google_Client;
use Google_Service_YouTube;
use LastFmTube\Util\Functions;

class YoutubeSearch {

    /*
     * Set $DEVELOPER_KEY to the "API key" value from the "Access" tab of the
     * Google Developers Console <https://console.developers.google.com/>
     * Please ensure that you have enabled the YouTube Data API for your project.
     */
    private $api_key     = '';
    private $api_version = '3';
    private $api_email   = '';
    private $api_json    = '';
    private $api_user    = '';
    private $needle      = '';
    private $video_list  = array();
    private $ignoreVids  = array();
    private $client;

    function __construct() {
        $this->client = new Google_Client ();
    }

    function ignoreVideo($video_id) {
        $this->ignoreVids [] = $video_id;
    }

    function setAPIJson($apijson) {
        $this->api_json = $apijson;
    }

    function setAPIEmail($email) {
        $this->api_email = $email;
    }

    function setAPIUser($user) {
        $this->api_user = $user;
    }

    function setAPIKey($key) {
        $this->api_key = $key;
    }

    function setAPIVersion($version) {
        $this->api_version = $version;
    }

    function setNeedle($needle) {
        $this->needle = $needle;
    }

    function search($resultcount = 1) {
        $this->video_list = array();

        if (!empty ($this->api_json)) {
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $this->api_json);
            $this->client->useApplicationDefaultCredentials();
        }
        else if (!empty ($this->api_key)) {
            // logMessage ( 'Create youtube client using API Key.' );
            $this->client->setDeveloperKey($this->api_key);
        }
        // Define an object that will be used to make all API requests.

        $youtube = new Google_Service_YouTube ($this->client);

        try {
            // Call the search.list method to retrieve results matching the specified
            // query term.

            $searchResponse = $youtube->search->listSearch('id,snippet',
                                                           array('q'    => $this->needle, 'maxResults' => $resultcount,
                                                                 'type' => 'video')
            );


            // $channels = '';
            // $playlists = '';

            // Add each result to the appropriate list, and then display the lists of
            // matching videos, channels, and playlists.
            foreach ($searchResponse->getItems() as $searchResult) {
                switch ($searchResult ['id'] ['kind']) {
                    case 'youtube#video' :
                        $video = new YoutubeVideo ();

                        $video->setTitle($searchResult ['snippet'] ['title']);
                        $video->setVideoID($searchResult ['id'] ['videoId']);
                        if (!in_array($searchResult ['id'] ['videoId'], $this->ignoreVids)) {
                            $this->video_list [] = $video;
                        }
                        break;
                    // case 'youtube#channel' :
                    // $channels .= sprintf ( '<li>%s (%s)</li>', $searchResult ['snippet'] ['title'], $searchResult ['id'] ['channelId'] );
                    // break;
                    // case 'youtube#playlist' :
                    // $playlists .= sprintf ( '<li>%s (%s)</li>', $searchResult ['snippet'] ['title'], $searchResult ['id'] ['playlistId'] );
                    // break;
                }
            }
        } catch (Exception $e) {
            Functions::getInstance()->logMessage('A service error occurred: ' . $e->getMessage());
        }
    }

    function getVideoList() {
        return $this->video_list;
    }

    /**
     *
     * Convert an object to an array
     *
     * @param object $object
     *            The object to convert
     * @return      mixed|array|object
     *
     */
    private static function objectToArray($object) {
        if (!is_object($object) && !is_array($object)) {
            return $object;
        }
        if (is_object($object)) {
            $object = get_object_vars($object);
        }
        return array_map('objectToArray', $object);
    }
}
