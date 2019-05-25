<?php
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
     * @var int
     */
    var $likeCount;

    /**
     *
     * @param Google_Service_YouTube_Comment $comment
     * @param Google_Service_YouTube_CommentThreadReplies $replies
     */
    public function __construct($comment, $replies) {
        $this->text = $comment->getSnippet ()->getTextDisplay ();
        $this->username = $comment->getSnippet ()->getAuthorDisplayName ();
        $this->date = $comment->getSnippet ()->getPublishedAt ();
        $this->useravatarUrl = $comment->getSnippet ()->getAuthorProfileImageUrl ();
        $this->likeCount = $comment->getSnippet ()->getLikeCount ();

        /**
         *
         * @var Google_Service_YouTube_Comment $replComment
         */
        foreach ( $replies->getComments () as $replComment ) {
            $this->answerComments [] = new VideoComment ( $replComment, array () );
        }
    }
}