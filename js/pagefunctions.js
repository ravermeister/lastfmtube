function initPlaylistDnD(){
	elem = $("#playlistdata .track_row");	
	elem.draggable({    
		revert: false,
		cursor: 'move',
		helper: function() {
			var $originals = $(this).children();
			var $helper = $(this).clone();

			$helper.addClass('dragelem');
			$helper.children().each(function(index) {
				$(this).width($originals.eq(index).width());
				$(this).addClass('dragelem');
			});
			return $helper;
		},
		opacity: 0.8,
		start: null,
		stop: null		
	}).disableSelection(); 	
}

function initToggle(){
	
	charts_title = $("#charts_title");
	charts_title.unbind('hover');
	charts_title.unbind('click');	
	charts_title.hover(inHover,outHover);
	charts_title.click(function(){
		charts_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
		doClick('charts'); 		
	});

	topuser_title = $("#topuser_title");
	topuser_title.unbind('hover');
	topuser_title.unbind('click');	
	topuser_title.hover(inHover,outHover);
	topuser_title.click(function(){
		topuser_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
		doClick('topuser'); 
	});

	user_title = $("#user_title");
	user_title.unbind('hover');
	user_title.unbind('click');	
	user_title.hover(inHover,outHover);
	user_title.click(function(){
		user_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
		doClick('user'); 
	});

	playlist_title = $("#playlist-title");
	playlist_title.unbind('hover');
	playlist_title.unbind('click');
	playlist_title.hover(inHover,outHover);
	playlist_title.click(function(){
		playlist_title.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
		doClick('playlist'); 
	});
}

    function inHover(){
	$(this).css('cursor','pointer');
    }                                   
    function outHover(){
	$(this).css('cursor','default');
    }     
    function doClick(type){
	elem = null;
	elem_title = null;
	elem_title_basetext = null;
	hide_elems = new Array();
	
	if(type=='hotkeys'){
	    elem = $("#hotkeys_view");
	    elem_title = $("#hotkeys_title");
	    elem_title_basetext = messageResource.get('hotkeys.title','locale',locale);                                                                                              
	} else if(type=='charts'){
	    elem = $("#charts_list");
	    elem_title = $("#charts_title");
	    elem_title_basetext = messageResource.get('charts.title','locale',locale);
	    
	    hide_elems[0] = $("#topuser_list");
	    hide_elems[1] = $("#playlist-title");	    
	} else if(type=='topuser'){
	    elem = $("#topuser_list");
	    elem_title = $("#topuser_title");
	    elem_title_basetext = messageResource.get('topuser.title','locale',locale);
	    
	    hide_elems[0] = $("#charts_list");
	    hide_elems[1] = $("#playlist-title");
	} else if(type=='user'){
	    elem = $("#user_list");
	    elem_title = $("#user_title");
	    elem_title_basetext = messageResource.get('userplaylist.title','locale',locale);
	} else if(type=='playlist') {
	    elem = $("#playlistdata").parent();
	    elem_title = $("#playlist-title");
	    elem_title_basetext = messageResource.get('playlist.title','locale',locale);
	    
	    hide_elems[0] = $("#charts_list");
	    hide_elems[1] = $("#topuser_list");
	}
	
	elem_title_str = elem_title_basetext;
	if(elem.is(":visible")){
	    elem_title_str = '+ '+elem_title_basetext;
	}else {
	    elem_title_str = '- '+elem_title_basetext;
	}                                            
	elem_title.html(elem_title_str);       		        
	elem.toggle(600);
	
	for(cnt=0;cnt<hide_elems.length;cnt++) {
		hide_elems[cnt].hide();
	}
}    

function initHotkeys(){
	hotkeys = $("#hotkeys_title");                                                            
	hotkeys.prop('title', messageResource.get('hotkeys.tooltip','locale',locale));
	hotkeys.hover(inHover,outHover);
	hotkeys.click(function(){
	doClick('hotkeys');                                      
	});	
	
	$('#pagefield').keyup(function(e){
		if(e.keyCode==13) loadPage('pagefield','playlistdata',totalpages);
	});

	$("#pageload").click(function(){
		loadPage('pagefield','playlistdata',totalpages); 
	});

	$("#loadnext").click(function(){        
		loadNextPage(false); 
	});

	$("#loadprev").click(function(){        
		loadPrevPage(false); 
	});   
	
	$("#lastfm_user").keyup(function(e){        
		if(e.keyCode==13) loadLastFMUser();
	}); 
}


function pageInit(){
	initToggle();
	initHotkeys();
	setPageCount(totalpages);
	initPlaylistDnD();
	
	$('#charts_list').ready(function(){
		setTimeout(charts_load(), 50);
		//charts_load();  			
		charts_setActive(chartcounter);                                        
		charts_setCurrentTrack(start_track);   
	});
	$('#topuser_list').ready(function(){
		setTimeout(topusers_load, 50);
		//topusers_load(); 	
	});	
	$('#user_list').ready(function (){
		setTimeout(userlist_loadPlaylist, 50);
		//userlist_loadPlaylist();
	});

	
	//context menu init
	$(function() {
	      $(".cmenu_user").contextMenu( cmenu_user_base_menu , cmenu_user_base_options );
	});
	$(function() {
		$(".cmenu_charts").contextMenu( cmenu_charts_base_menu , cmenu_charts_base_options );
	});	
}