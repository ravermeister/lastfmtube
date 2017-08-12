function Functions(){

  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }

  arguments.callee._singletonInstance = this;


}

function Functions.getInstance = function() {
    var functions = new Functions();
    return functions;
};

function Functions.prototype.inHover(elem) {
	$(elem).css('cursor','pointer');
}
function Functions.prototype.outHover(elem){
	$(this).css('cursor','default');
}

function Functions.prototype.doClick(type){
	elem = null;
	elem_title = null;
	elem_title_basetext = null;
	
	if(type=='hotkeys'){
	    elem = $("#hotkeys_view");
	    elem_title = $("#hotkeys_title");
	    elem_title_basetext = messageResource.get('hotkeys.title','locale',locale);                                                                                              
	} else if(type=='charts'){
	    elem = $("#charts_list");
	    elem_title = $("#charts_title");
	    elem_title_basetext = messageResource.get('charts.title','locale',locale);
	} else if(type=='topuser'){
	    elem = $("#topuser_list");
	    elem_title = $("#topuser_title");
	    elem_title_basetext = messageResource.get('topuser.title','locale',locale);
	} else if(type=='user'){
	    elem = $("#user_list");
	    elem_title = $("#user_title");
	    elem_title_basetext = messageResource.get('userplaylist.title','locale',locale);
	} else if(type=='playlist') {
	    elem = $("#playlistdata").parent();
	    elem_title = $("#playlist-expandbt");
	    elem_title_basetext = messageResource.get('playlist.title','locale',locale);
	}
	
	elem_title_str = elem_title_basetext;
	if(elem.is(":visible")){
	    elem_title_str = '+ '+elem_title_basetext;
	}else {
	    elem_title_str = '- '+elem_title_basetext;
	}                                            
	elem_title.html(elem_title_str);       		        
	elem.toggle(600);
} 

function Functions.prototype.initToggle(){
	charts_title = $("#charts_title");
	charts_title.unbind('hover');
	charts_title.unbind('click');
	charts_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
	charts_title.hover(inHover,outHover);
	charts_title.click(function(){
	   this.doClick('charts'); 
	});

	topuser_title = $("#topuser_title");
	topuser_title.unbind('hover');
	topuser_title.unbind('click');
	topuser_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
	topuser_title.hover(inHover,outHover);
	topuser_title.click(function(){
	   this.doClick('topuser'); 
	});

	user_title = $("#user_title");
	user_title.unbind('hover');
	user_title.unbind('click');
	user_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
	user_title.hover(inHover,outHover);
	user_title.click(function(){
	   this.doClick('user'); 
	});

	playlist_title = $("#playlist-expandbt");
	playlist_title.unbind('hover');
	playlist_title.unbind('click');
	playlist_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
	playlist_title.hover(inHover,outHover);
	playlist_title.click(function(){
	   this.doClick('playlist'); 
	});
}

function Functions.prototype.initHotkeys(){
	hotkeys = $("#hotkeys_title");                                                            
	hotkeys.prop('title', messageResource.get('hotkeys.tooltip','locale',locale));
	hotkeys.hover(inHover,outHover);
	hotkeys.click(function(){
		this.doClick('hotkeys');                                      
	});	
	
	$('#pagefield').keyup(function(e){
		if(e.keyCode==13) loadPage('pagefield','playlistdata',{$total_pages});
	});

	$("#pageload").click(function(){
		loadPage('pagefield','playlistdata',{$total_pages}); 
	});

	$("#loadnext").click(function(){        
		loadNextPage(false); 
	});

	$("#loadprev").click(function(){        
		loadPrevPage(false); 
	});   
}

function Functions.prototype.pageInit(ytplayer){
	
	this.initToggle();
	this.initHotkeys();
	ytplayer.setPageCount(totalpages);

	
	$('#charts_list').ready(function(){
		setTimeout(ytplayer.charts_load(), 50);
		//charts_load();  			
		charts_setActive(chartcounter);                                        
		charts_setCurrentTrack(start_track);   
	});
	
	$('#user_list').ready(function (){
		setTimeout(userlist_loadPlaylist, 100);
		//userlist_loadPlaylist();
	});
	$('#topuser_list').ready(function(){
		setTimeout(topusers_load, 150);
		//topusers_load(); 	
	});
	
	//context menu init
	$(function() {
	      $(".cmenu_user").contextMenu( cmenu_user_base_menu , cmenu_user_base_options );
	});
	$(function() {
		      $(".cmenu_charts").contextMenu( cmenu_charts_base_menu , cmenu_charts_base_options );
	});
}