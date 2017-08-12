function YouTubePlayer(){
	tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);	
}

function YouTubePlayer.prototype.onYouTubeIframeAPIReady() {
   
  if((typeof window['start_track'] !== 'undefined') && start_track.videoId!=''){
	  startvideo = start_track.videoId;
  }
  if (typeof ytplayerwidth === 'undefined') {
	console.log('Player width not defined');
 	ytplayerwidth = '100%';
  }
  if (typeof ytplayerheight === 'undefined') {
	console.log('Player height not defined');
	ytplayerheight = '600px';
  }	
  
    ytplayer = new YT.Player('player', {
	    
        height: ytplayerheight,
        width: ytplayerwidth,
        videoId: startvideo, 
                   
        playerVars: {
            'allowfullscreen': 1,                
            'allowscriptaccess': 'always',
            'webkitallowfullscreen': 1,
            'mozallowfullscreen': 1,
            'autoplay': 1,
            'html5': 1,
            'enablejsapi': 1,           
            'fs': 1,   
            'playerapiid': 'lastfmplayer'
        }, 
                                                
        events: {        
            'onReady': onYouTubePlayerReady,
            'onStateChange': playerStateChange,
            'onError': playerStateError    
        }
    });

}