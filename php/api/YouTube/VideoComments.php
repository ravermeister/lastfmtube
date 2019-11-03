<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\YouTube;

use Google_Service_YouTube_CommentThreadListResponse;


class VideoComments {

     /**
      *
      * @var VideoComments
      */
     var $videoId;

     /**
      *
      * @var array
      */
     var $commentList = array();

     /**
      *
      * @var array
      */
     var $pageinfo = array(
          'CURRENT' => 1,
          'ALL' => 1,
          'PER_PAGE' => 25
     );

    /**
     *
     * @param string $videoId
     * @param Google_Service_YouTube_CommentThreadListResponse $commentThreadResponse
     * @param int $page
     */
     function __construct($videoId, $commentThreadResponse, $page = 1) {
          $this->videoId = $videoId;
          $this->initList($commentThreadResponse->getItems());

          $this->pageinfo['CURRENT'] = $page;
          $this->pageinfo['PER_PAGE'] = $commentThreadResponse->getPageInfo()->getResultsPerPage();
          $this->pageinfo['ALL'] = $commentThreadResponse->getPageInfo()->getTotalResults();
          $this->pageinfo['NEXT'] = $commentThreadResponse->getNextPageToken();
     }

     public function initList($document) {
          $this->commentList = array();

          /**
           *
           * @var Google_Service_YouTube_CommentThread $commentThread
           */
          foreach ($document as $commentThread) {
               /**
                *
                * @var Google_Service_YouTube_CommentThreadSnippet $snippet
                */
               $snippet = $commentThread->getSnippet();
               $this->commentList[] = new VideoComment($snippet->getTopLevelComment(), $commentThread->getReplies());
          }
     }

     public function toJson() {
          $json = array();

          /**
           *
           * @var VideoComment $comment
           */
          foreach ($this->commentList as $comment) {
               $jsonComment = array(
                    'username' => $comment->username,
                    'useravatar' => $comment->useravatarUrl,
                    'userchannel' => $comment->userchannelUrl,
                    'likes' => $comment->likeCount,
                    'date' => $comment->date,
                    'text' => $comment->text,
                    'replies' => array()
               );

               /**
                *
                * @var VideoComment $acomment
                */
               /**
                * foreach ($comment->answerComments as $acomment) {
                * $jsonAnswerComment = array (
                * 'username' => $comment->username,
                * 'useravatar' => $comment->useravatarUrl,
                * 'likes' => $comment->likeCount,
                * 'date' => $comment->date,
                * 'text' => $comment->text
                * );
                * $jsonComment['replies'][] = $jsonAnswerComment;
                * }
                */
               $json['comments'][] = $jsonComment;
          }

          $json['pageinfo'] = $this->pageinfo;

          return $json;
     }
}