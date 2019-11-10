<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\YouTube;

use LastFmTube\Util\Functions;
use Exception;
use Google_Client;
use Google_Service_YouTube;

class YouTubeSearch {

     /*
      * Set $DEVELOPER_KEY to the "API key" value from the "Access" tab of the
      * Google Developers Console <https://console.developers.google.com/>
      * Please ensure that you have enabled the YouTube Data API for your project.
      */
     private $api_key = '';

     private $api_version = '3';

     private $api_email = '';

     private $api_json = '';

     private $api_user = '';

     private $needle = '';

     private $ignoreVids = array();

    /**
     * @var Google_Client
     */
     private $client;

    /**
     * @var Google_Service_YouTube
     */
     private $youtube;

     function __construct() {
          $this->client = new Google_Client();
     }

     /**
      *
      * Convert an object to an array
      *
      * @param object $object
      *             The object to convert
      * @return mixed|array|object
      *
      */
     private static function objectToArray($object) {
          if (! is_object($object) && ! is_array($object)) {
               return $object;
          }
          if (is_object($object)) {
               $object = get_object_vars($object);
          }
          return array_map('objectToArray', $object);
     }

     function ignoreVideo($video_id) {
          $this->ignoreVids[] = $video_id;
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

    /**
     *
     * @param string $videoId
     * @param bool $page
     * @param int $limit
     * @return VideoComments|mixed
     */
     function searchComments($videoId, $page = false, $limit = 7) {
          $this->initYTApi();

          $args = array(
               'videoId' => $videoId,
               'maxResults' => $limit
          );

          if ($page !== false) {
               $args['pageToken'] = $page;
          }

          $searchResponse = $this->youtube->commentThreads->listCommentThreads('snippet,id', $args);

          return new VideoComments($videoId, $searchResponse, $page);
     }

     private function initYTApi() {
          if (! empty($this->api_json)) {
               putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $this->api_json);
               $this->client->useApplicationDefaultCredentials();
          } else if (! empty($this->api_key)) {
               // logMessage ( 'Create youtube client using API Key.' );
               $this->client->setDeveloperKey($this->api_key);
          }
          // Define an object that will be used to make all API requests.

          $this->youtube = new Google_Service_YouTube($this->client);
     }

     function searchVideo($resultcount = 1) {
          $video_list = array();
          $this->initYTApi();

          try {
               // Call the search.list method to retrieve results matching the specified
               // query term.
              /**
               * @var Google_Service_YouTube_SearchListResponse
               */
               $SearchResponse = $this->youtube->search->listSearch('id,snippet', array(
                    'q' => $this->needle,
                    'maxResults' => $resultcount,
                    'type' => 'video'
               ));

               // $channels = '';
               // $playlists = '';

               // Add each result to the appropriate list, and then display the lists of
               // matching videos, channels, and playlists.
               foreach ($SearchResponse->getItems() as $searchResult) {
                    switch ($searchResult['id']['kind']) {
                         case 'youtube#video':
                              $video = new YouTubeVideo();
                              $title = Functions::getInstance()->decodeHTML($searchResult['snippet']['title']);
                              $vid = $searchResult['id']['videoId'];

                              $video->setTitle($title);
                              $video->setVideoID($vid);

                              if (in_array($vid, $this->ignoreVids)) {
                                   continue 2; // skip ignored video
                              }
                              $video_list[] = $video;
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
               throw $e;
          }

          return $video_list;
     }
}
