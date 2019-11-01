/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class HotKeys {
	
	static initGlobal() {
		// always use hotkeys for all elements.
		// see https://www.npmjs.com/package/hotkeys-js#filter
		hotkeys.filter = function(event){
			  return true;
		};
		
    	hotkeys('left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault();     		
    		$player.rewind();    		
    	});
    	
    	hotkeys('ctrl+left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadPreviousSong();    		
    	});
    	
    	hotkeys('right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.fastForward();    		
    	});
    	
    	hotkeys('ctrl+right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadNextSong();    		
    	});    	
    	
    	hotkeys('up', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.volumeUp();    		
    	});
    	
    	hotkeys('down', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.volumeDown();    		
    	});
    	
    	hotkeys('space, enter', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.togglePlay();    		
    	});

    	hotkeys('ctrl+1', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('video')
    	});
    	
    	hotkeys('ctrl+2', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('lastfm');
    	});
    	
    	hotkeys('ctrl+3', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('personal');    		
    	});
    	
    	hotkeys('ctrl+4', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('topsongs');    		
    	});
    	
    	hotkeys('ctrl+5', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('users');    		
    	});
    	
    	/**
		 * TODO: add hotkeys for search
		 */
	}
	
	static initPlayerWindow(){
		let ytPlayer = $('#player-container');
    	console.log(ytPlayer);
    	
    	hotkeys('enter', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.togglePlay();    		
    	});
		
    	hotkeys('ctrl+1', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('video')
    	});
    	
    	hotkeys('ctrl+2', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('lastfm');
    	});
    	
    	hotkeys('ctrl+3', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('personal');    		
    	});
    	
    	hotkeys('ctrl+4', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('topsongs');    		
    	});
    	
    	hotkeys('ctrl+5', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('users');    		
    	});
    	
    	hotkeys('ctrl+left', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadPreviousSong();    		
    	});
    	
    	hotkeys('ctrl+right', {
    		element: ytPlayer
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadNextSong();    		
    	}); 
    	
    	/**
		 * TODO: add hotkeys for search
		 */
	}
	
	static init() {
		HotKeys.initGlobal();
		HotKeys.initPlayerWindow();
	}
}