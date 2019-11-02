/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PlayerWindow {

	constructor(initReadyCallback){
		this.status = {
			UNSTARTED: { ID: -1, NAME: 'unstarted' },
			ENDED: { ID: 0, NAME: 'ended' },
			PLAYING: { ID: 1, NAME: 'playing' },
			PAUSED: { ID: 2, NAME: 'paused' },
			BUFFERING: { ID: 3, NAME: 'buffering' },
			CUED: { ID: 5, NAME: 'video cued'}
		};
		
		this.ytPlayer = null;
		this.createPlayer(initReadyCallback);
	}
	
	initYtPlayer(width, height, video, initReadyCallback) {

        let onReady = function (event) {
        	$player.isReady = true;
// console.log('youtube player ready');
        	if(typeof initReadyCallback === 'function') {
        		initReadyCallback();
        	}
        };

        let onStateChange = function (event) {

            for (let cnt in $player.stateChangeListeners) {
                let listener = $player.stateChangeListeners[cnt];
                if ('function' !== typeof listener) continue;
                listener(event);
            }
        };
        let onError = function (event) {
            console.error('youtube player error', event);
            for (let cnt in $player.errorListeners) {
                let listener = $player.errorListeners[cnt];
                if ('function' !== typeof listener) continue;
                listener(event);
            }
        };
		
		//console.log('player: w', width, 'h', height, 'vid', video);
	    this.ytPlayer = new YT.Player('player-container', {
	
	        height: height,
	        width: width,
	        videoId: video,
	        crossDomain: true,
	        origin: '',
	        playerVars: {
	            'allowfullscreen': 1,
	            'allowscriptaccess': 'always',
	            'webkitallowfullscreen': 1,
	            'mozallowfullscreen': 1,
	            'autoplay': 1,
	            'html5': 1,
	            'enablejsapi': 1,
	            'fs': 1,
	            'playerapiid': 'lastfmtube'
	        },
	
	        events: {
	            'onReady': onReady,
	            'onStateChange': onStateChange,
	            'onError': onError
	            }
	        });
	}
	
	
	createPlayer(initReadyCallback) {
        // $.getScript('//www.youtube.com/iframe_api');
        let tag = document.createElement('script');
        tag.src = '//www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        let playerWindow = this;
        
        window.onYouTubeIframeAPIReady = function () {            
        	$(document).ready(function () {
        		
                let percentHeight = function (abs, val) {
                    return ((abs / 100) * val) | 0;
                };

                // '9RMHHwJ9Eqk';
                let startVideo = '';
                let ytPlayerWidth = '100%';
                let ytPlayerHeight = percentHeight($(document).height(), 70) + 'px';
                if($page.settings.general.playerHeight !== 'auto') {
					ytPlayerHeight = $page.settings.general.playerHeight;
				}	    
				if($page.settings.general.playerWidth !== 'auto') {
					ytPlayerWidth = $page.settings.general.playerWidth;
				}

				playerWindow.initYtPlayer(ytPlayerWidth, ytPlayerHeight, startVideo, initReadyCallback);                
            });
        };
	}
}