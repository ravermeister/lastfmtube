/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class HotKeys {
	
	
	
	constructor(){
		this.globalInit = false;
		this.ytPlayerInit = false;
	}
	
	static init(){
		HotKeys.initGlobal();
		HotKeys.initYtPlayer();
	}
	
	static initGlobal() {
		
		if(HotKeys.globalInit === true) return;
		
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
    	
    	
		HotKeys.globalInit = true;
	}
	
	static initYtPlayer(){
		
		if(HotKeys.ytPlayerInit == true) return;
		
		let ytelem = $('player-container');
		console.log('>>>',ytelem);
		
    	hotkeys('ctrl+left', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadPreviousSong();    		
    	});

    	hotkeys('ctrl+right', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadNextSong();    		
    	});   
		
    	hotkeys('ctrl+2', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('lastfm');
    	});
    	
    	hotkeys('ctrl+3', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('personal');    		
    	});
    	
    	hotkeys('ctrl+4', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('topsongs');    		
    	});
    	
    	hotkeys('ctrl+5', {
    		element: ytelem
    	}, function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('users');    		
    	});
		
		HotKeys.ytPlayerInit = true;
	}
}