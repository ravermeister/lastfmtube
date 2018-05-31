
function scrollIntoView(element, container) {

    var jqContainer = $(container);
    var jqElement   = $(element);

    var containerTop = jqContainer.scrollTop();
    var containerBottom = containerTop + jqContainer.height();
    var elemTop = element.offsetTop;
    var elemBottom = elemTop + jqElement.height();
    if (elemTop < containerTop) {
        jqContainer.scrollTop(elemTop);
    } else if (elemBottom > containerBottom) {
        jqContainer.scrollTop(elemBottom - jqContainer.height());
    }
}

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

function doClick(type) {
	
	elem = null;
	elem_title = null;
	elem_title_basetext = null;
	hide_elems = new Array();
	hide_elems[0] = new Array();
	hide_elems[1] = new Array();
	hide_other = false;
	fade_type = 'none';
	
	switch(type){
		case 'hotkeys':
			elem = $("#hotkeys_view");
			elem_title = $("#hotkeys_title");
			elem_title_basetext = messageResource.get('hotkeys.title','locale',locale);			
		break;
		
		case 'charts':
			elem = $("#charts_list");
			elem_title = $("#charts_title");
			elem_title_basetext = messageResource.get('charts.title','locale',locale);

			hide_other = true;
			fade_type='main';
			hide_elems[0][0] = messageResource.get('topuser.title','locale',locale);
			hide_elems[0][1] = $("#topuser_title");
			hide_elems[0][2] = $("#topuser_list");

			hide_elems[1][0] = messageResource.get('playlist.title','locale',locale);
			hide_elems[1][1] = $("#playlist-title");
			hide_elems[1][2] = $("#playlistdata").parent();			
		break;
		
		case 'topuser':
			elem = $("#topuser_list");
			elem_title = $("#topuser_title");
			elem_title_basetext = messageResource.get('topuser.title','locale',locale);

			hide_other = true;
			fade_type='main';
			hide_elems[0][0] = messageResource.get('charts.title','locale',locale);
			hide_elems[0][1] = $("#charts_title");
			hide_elems[0][2] = $("#charts_list");

			hide_elems[1][0] = messageResource.get('playlist.title','locale',locale);
			hide_elems[1][1] = $("#playlist-title");
			hide_elems[1][2] = $("#playlistdata").parent();
		break;
		
		case 'user':
			elem = $("#user_list");
			elem_title = $("#user_title");
			elem_title_basetext = messageResource.get('userplaylist.title','locale',locale);
			fade_type='user';
		break;
		
		case 'playlist':
			elem = $("#playlistdata").parent();
			elem_title = $("#playlist-title");
			elem_title_basetext = messageResource.get('playlist.title','locale',locale);
			
			hide_other = true;
			fade_type='main';
			hide_elems[0][0] = messageResource.get('charts.title','locale',locale);
			hide_elems[0][1] = $("#charts_title");
			hide_elems[0][2] = $("#charts_list");

			hide_elems[1][0] = messageResource.get('topuser.title','locale',locale);
			hide_elems[1][1] = $("#topuser_title");
			hide_elems[1][2] = $("#topuser_list");
		break;
		
	}

	elem_title_str = elem_title_basetext;
	if(elem.is(":visible")) {
		elem_title_str = '+ '+elem_title_basetext;
	} else  {
		elem_title_str = '- '+elem_title_basetext;
	}
	
	if(fade_type!='none') {
		fadeContentWidth(fade_type, !elem.is(":visible"));
	}
	
	if(hide_other) {
		for(cnt=0;cnt<hide_elems.length;cnt++) {
			hide_elem_title_basetext	= hide_elems[cnt][0];
			hide_elem_title 			= hide_elems[cnt][1];
			hide_elem 			= hide_elems[cnt][2];

			hide_elem_title_str = '+ '+hide_elem_title_basetext;
			hide_elem_title.html(hide_elem_title_str);
			hide_elem.hide(0);
		}
	}
	
	elem_title.html(elem_title_str);
	elem.toggle(0);	
}

function fadeContentWidth(type, nextvisible) {
	
	userlist = $("#user_list");
	charts = $("#charts_list");
	topuser = $("#topuser_list");
	playlist = $("#playlistdata").parent();
	
	sidebar_visible = userlist.is(":visible");
	main_visible = charts.is(":visible") || topuser.is(":visible") || playlist.is(":visible");

	main_width = '100%';
	sidebar_width = '0%';
		
	if (type == 'user') {
		if(sidebar_visible) {
			main_width = '100%';
			sidebar_width = '0%';
		} //sidebar becomes invisible
		
		else if(main_visible) {
			main_width = '74%';
			sidebar_width = '25%';
		} //sidebar becomes visible and main is visible
		
		else {
			main_width = '0%';
			sidebar_width = '100%';			
		} //sidebar becomes visible and main is invisible
		
	} //userlist clicked
	
	else if(nextvisible) {
		if(sidebar_visible) {
			main_width = '74%';
			sidebar_width = '25%';			
		} else {
			main_width = '100%';
			sidebar_width = '0%';			
		}
	} //main becomes visible
	
	else if(sidebar_visible) {		
		main_width = '0%';
		sidebar_width = '100%';			
	}  //main becomes invisible and sidebar is visible
	
	else {
		main_width = '100%';
		sidebar_width = '0%';			
	} //main becomes invisible and sidebar is invisible


	$('.playlist-container .playlist-main').css('width',main_width);
	$('.playlist-container .playlist-sidebar').css('width',sidebar_width);
}

function inHover(){
	$(this).css('cursor','pointer');
}
function outHover(){
	$(this).css('cursor','default');
}


function initHotkeys(){
	hotkeys = $("#hotkeys_title");	
	hotkeys.ready(function(){
		setTimeout(function(){
			hotkeys.prop('title', messageResource.get('site.tooltip.hideshow','locale',locale));
		}, 50);
	});
	//hotkeys.prop('title', 'Show/Hide');
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
	initContextMenu();
	initHotkeys();
	setPageCount(totalpages);
	initPlaylistDnD();

	$('#charts_list').ready(function(){		
		//charts_load();
		charts_setCurrentTrack(start_track);
		charts_setActive(chartcounter);				
		setTimeout(charts_load(), 50);
	});
	$('#topuser_list').ready(function(){
		setTimeout(topusers_load, 50);
		//topusers_load();
	});
	$('#user_list').ready(function (){
		setTimeout(userlist_loadPlaylist, 50);
		//userlist_loadPlaylist();
	});	
}