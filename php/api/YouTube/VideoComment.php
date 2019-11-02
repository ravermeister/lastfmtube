<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\YouTube;

use Google_Service_YouTube_Comment;
use LastFmTube\Util\Functions;

class VideoComment {

     /**
      *
      * @var string
      */
     var $videoId;

     /**
      *
      * @var array
      */
     var $answerComments;

     /**
      *
      * @var string
      */
     var $username;

     /**
      *
      * @var mixed
      */
     var $date;

     /**
      *
      * @var string
      */
     var $text;

     /**
      *
      * @var string
      */
     var $useravatarUrl;

     /**
      *
      * @var string
      */
     var $userchannelUrl;

     /**
      *
      * @var int
      */
     var $likeCount;

    /**
     *
     * @param Google_Service_YouTube_Comment $comment
     * @param bool $replies
     */
     public function __construct($comment, $replies = false) {
          $this->text = $comment->getSnippet()->getTextDisplay();
          $this->username = $comment->getSnippet()->getAuthorDisplayName();
          $this->userchannelUrl = $comment->getSnippet()->getAuthorChannelUrl();
          $this->date = $comment->getSnippet()->getPublishedAt();
          $this->useravatarUrl = $comment->getSnippet()->getAuthorProfileImageUrl();
          $this->likeCount = $comment->getSnippet()->getLikeCount();

          if ($replies !== false) {
               Functions::getInstance()->logMessage(print_r($replies, true));
          /**
           *
           * @var Google_Service_YouTube_Comment $replComment
           */
          /**
           * foreach ( $replies->getComments () as $replComment ) {
           * $this->answerComments [] = new VideoComment ( $replComment );
           * }
           */
          }
     }
}