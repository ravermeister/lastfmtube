<?php

namespace LastFmTube\Api\YouTube;

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
    var $commentList = array ();
    function __construct($videoId, $rawDocument) {
        $this->video = $videoId;
        $this->initList ( $rawDocument );
    }
    public function initList($document) {
        $this->commentList = array ();

        /**
         *
         * @var Google_Service_YouTube_CommentThread $commentThread
         */
        foreach ( $document as $commentThread ) {
            /**
             *
             * @var Google_Service_YouTube_CommentThreadSnippet $snippet
             */
            $snippet = $commentThread->getSnippet ();
            $this->commentList [] = new VideoComment ( $snippet->getTopLevelComment (), $commentThread->getReplies () );
        }
    }
    public function toJson() {
        $json = array ();

        /**
         *
         * @var VideoComment $comment
         */
        foreach ( $this->commentList as $comment ) {
            $jsonComment = array (
                    'username' => $comment->username,
                    'useravatar' => $comment->useravatarUrl,
                    'userchannel' => $comment->userchannelUrl,
                    'likes' => $comment->likeCount,
                    'date' => $comment->date,
                    'text' => $comment->text,
                    'replies' => array ()
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
            $json [] = $jsonComment;
        }

        return $json;
    }
}