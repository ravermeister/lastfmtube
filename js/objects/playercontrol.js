/**
*encoding: UTF-8
**/
function PlayerControl() {
	this.loading_error		= false;
	this.initialized		= false;
	this.loadPage_active		= false;
	this.context_menu_active	= false;
	this.embed_method		= METHOD.FLASH;
	this.current_playlist 		= PLAYLIST.DEFAULT;
	this.default_imagecell  	= null;
	this.default_active_row 	= null;
	this.active_page 		= 1;
	this.all_pages   		= -1;
	this.ytplayer 			= null;


	this.charts_active_row   	= null;
	this.charts_imagecell    	= null;
	
	this.custom_active_row   	= null;
	this.custom_imagecell    	= null;

	this.image_equalizer     	= new Image();
	this.image_equalizer.src     	= './images/equalizer.gif';
	this.image_equalizer.width   	= 20;
	this.image_equalizer.height  	= 15;

}

function PlayerControl.prototype.setPageCount(pagecnt) {
    all_pages = pagecnt;
}

function PlayerControl.prototype.stripCRLF(rawString) {
    start = -1;
    end = -1;
    for(cnt=0;cnt<rawString.length;cnt++) {
        if(
            '\r'!=rawString.charAt(cnt)&&
            '\n'!=rawString.charAt(cnt)&&
            '\t'!=rawString.charAt(cnt)
          ) {
            break;
        }
        start=cnt;                    
    }
        
    for(cnt=(rawString.length-1);cnt>=0;cnt--) {
        if(
            '\r'!=rawString.charAt(cnt)&&
            '\n'!=rawString.charAt(cnt)&&
            '\t'!=rawString.charAt(cnt)
          ) {
            break;
        }
        
        end=cnt;
    }
    
    if(start!=-1) {
        if(end!=-1)
            return rawString.substring(start,end);
        else    
            return rawString.substring(start);   
    }
    else if(end!=-1)
        return rawString.substring(0,end);
    else
        return rawString;
        
}

function PlayerControl.prototype.loadMovieCharts(elem) {
    cells               = elem.children('td');
    needle              = new Object();
    needle.artist       = $(cells.get(1)).text();
    needle.title        = $(cells.get(2)).text();              
    
    if(ytplayer!=null) {        
        vars_request_url='./php/edit_env_vars.php?action=get&key='+encodeURIComponent(needle.artist+' '+needle.title);     
        
        
    	$.ajax(vars_request_url,{
    	   dataType: 'text'
    	})
        .done(function(vars_data){            
            vars_data = stripCRLF(vars_data);
            
            if(vars_data!=''&&vars_data!='undefined') {   
                needle.videoId = vars_data;
                this.loadYoutubeVideo(needle);
                this.active_page = $('#pagefield').val();
            } else {
                search_request_url='./php/do_search.php?needle='+encodeURIComponent(needle.artist+' '+needle.title);      
            	$.ajax(search_request_url,{
            	   dataType: 'json' 
            	})
                .done(function(search_data){                          
                    if(search_data.length>0&&search_data[0].video_id!=''&&search_data[0].video_id!='undefined') {   
                        needle.videoId = search_data[0].video_id;                         
                        this.loadYoutubeVideo(needle);        
                        this.active_page = $('#pagefield').val();                                           
                    }                            
                    else                    
                        this.loadNextSong();    
                });
            }      	            
        });
     }
}

function PlayerControl.prototype.loadMoviePlaylist(elem){
    cells               = $(elem).children('div');
    needle              = new Object();
    needle.artist       = $(cells.get(2)).text();
    needle.title        = $(cells.get(3)).text();              
    
    if(ytplayer!=null) {        
        vars_request_url='./php/edit_env_vars.php?action=get&key='+encodeURIComponent(needle.artist+' '+needle.title);     
        
        
    	$.ajax(vars_request_url,{
    	   dataType: 'text'
    	})
        .done(function(vars_data){            
            vars_data = stripCRLF(vars_data);
            
            if(vars_data!=''&&vars_data!='undefined') {   
                needle.videoId = vars_data;
                this.loadYoutubeVideo(needle);                                        
                this.active_page = $('#pagefield').val();
            } else {
                search_request_url='./php/do_search.php?needle='+encodeURIComponent(needle.artist+' '+needle.title);      
            	$.ajax(search_request_url,{
            	   dataType: 'json' 
            	})
                .done(function(search_data){                          
                    if(search_data.length>0&&search_data[0].video_id!=''&&search_data[0].video_id!='undefined') {   
                        needle.videoId = search_data[0].video_id;                                                 
                        this.loadYoutubeVideo(needle);                        
                        
                        this.active_page = $('#pagefield').val();                                           
                    } else                    
                        this.loadNextSong();
                });
            }      	            
        });
     }
}

function PlayerControl.prototype.loadMovieUserList(elem) {

    cells               = elem.children('td');
    needle              = new Object();
    needle.artist       = $(cells.get(1)).text();
    needle.title        = $(cells.get(2)).text();              
    
    if(player!=null)
    {        
        vars_request_url='./php/edit_env_vars.php?action=get&key='+encodeURIComponent(needle.artist+' '+needle.title);     
        
        
    	$.ajax(vars_request_url,{
    	   dataType: 'text'
    	})
        .done(function(vars_data){            
            vars_data = stripCRLF(vars_data);
            
            if(vars_data!=''&&vars_data!='undefined')
            {   
                needle.videoId = vars_data;
                this.loadYoutubeVideo(needle);
                this.active_page = $('#pagefield').val();
            }  
            else
            {
                search_request_url='./php/do_search.php?needle='+encodeURIComponent(needle.artist+' '+needle.title);      
            	$.ajax(search_request_url,{
            	   dataType: 'json' 
            	})
                .done(function(search_data){                          
                    if(search_data.length>0&&search_data[0].video_id!=''&&search_data[0].video_id!='undefined')
                    {   
                        needle.videoId = search_data[0].video_id;                         
                        this.loadYoutubeVideo(needle);        
                        this.active_page = $('#pagefield').val();                                           
                    }                            
                    else                    
                        this.loadNextSong();    
                });
            }      	            
        });
     }

}

function PlayerControl.prototype.loadMovie(elem) {
    if(this.current_playlist==PLAYLIST.DEFAULT)
        this.loadMoviePlaylist(elem);
    else if(current_playlist==PLAYLIST.CHARTS)
        this.loadMovieCharts(elem);
    else if(current_playlist==PLAYLIST.CUSTOM)
        this.playlist_user_loadMovie(elem);
}

function PlayerControl.prototype.loadYoutubeVideo(trackdata) {
	if(ytplayer==null) return;
	ytplayer.loadVideoById(trackdata.videoId);
	this.setCurrentTrackCharts(trackdata);
}

function PlayerControl.prototype.loadLastfmUser() {
    lm_username = $("#lastfm_user").val();    
    trackid=-1;
    trackname='';
    trackartist='';
    
    if(this.default_imagecell!=null) {
        //row = default_imagecell.parentNode;
        trackid=this.default_active_row.getAttribute('id');  
    }
    
    playlist = $("#playlistdata");
    playlist.html('<div align="center" class="cmenu" style="width:100%;height:500px;vertical-align:center;"><img src="./images/progress.gif" width="300" height="300"/></div>');
    
    
    $.ajax('./php/change_lastfmuser.php',{
        type: 'POST', 
        dataType: 'json',
        data : {
            'lastfm_user' : lm_username
        }      
    }).done(function(response){
                
        $("#lastfm_user_title").text(lm_username);
        $("#lastfm_user_title_url").attr('href','http://www.last.fm/user/'+lm_username);
        $("#pagefield").val(response.current_page);
        $("#lastfm_user_pages_total").text(response.total_pages);
        
        this.active_page = response.current_page;
        this.all_pages   = response.total_pages;
        
        playlist.parent().replaceWith(response.playlist);
        
        if(current_playlist!=PLAYLIST.DEFAULT)
            return;
                                      
        if(trackid!=-1)        
        {        
            rows  = $("div.track_row");
            for(i=0;i<rows.length;i++)
            {
                curtrackid=rows[i].getAttribute('id');
 
                if(curtrackid==trackid)
                {
                    divs = default_active_row.getElementsByTagName('div');
                    trackartist=$(divs[2]).text();
                    trackname=$(divs[3]).text();
                    cur_divs=rows[i].getElementsByTagName('div');
                    cur_trackartist=$(cur_divs[2]).text();
                    cur_trackname=$(cur_divs[3]).text();
                    if(cur_trackartist==trackartist&&cur_trackname==trackname){
                        cells = rows[i].getElementsByTagName('div');
                        cells[0].appendChild(image_equalizer);
			for(j=0;j<cells.length;j++) $(cells[j]).css('fontWeight','bold');    
                        this.default_imagecell=cells[0];
                        this.default_active_row=this.default_imagecell.parentNode;       
                        
                        
                        trackid=this.default_active_row.getAttribute('id');           
                        break;   
                    }
                }
                
            }   
        }
        //if(autoplay) this.loadNextSong();
                                               
    });  
}

function PlayerControl.prototype.loadPlaylist(page,elem_id,autoplay) {
    trackid=-1;
    if(this.default_imagecell!=null)
    {
        //row = default_imagecell.parentNode;
        trackid=this.default_active_row.getAttribute('id');      
    }

    playlist_url='./php/get_playlist.php?page='+page;
    elem=document.getElementById(elem_id);
    //div_elem = document.createElement('div');
    //div_elem.setAttribute('align','center');
    //div_elem.setAttribute('class','cmenu');
    
    
    
    elem.innerHTML='<div align="center" class="cmenu" style="width:100%;height:500px;vertical-align:center;"><img src="./images/progress.gif" width="300" height="300"/></div>';
    
	$.ajax(playlist_url,{
        type: 'POST',
        dataType: 'text'
	})
    .done(function(playlist_data){        
        $(elem).parent().replaceWith(playlist_data);
        this.active_page = page;  
        
        if(this.current_playlist!=PLAYLIST.DEFAULT)
            return;
                                      
        if(trackid!=-1) {        
            rows  = $("div.track_row");
            for(i=0;i<rows.length;i++){
                curtrackid=rows[i].getAttribute('id');
 
                if(curtrackid==trackid){
                    cells = rows[i].getElementsByTagName('div');
		    for(j=0;j<cells.length;j++) $(cells[j]).css('fontWeight','bold');    
                    cells[0].appendChild(image_equalizer);
                    this.default_imagecell=cells[0];
                    this.default_active_row=default_imagecell.parentNode;       
                    
                    
                    trackid=this.default_active_row.getAttribute('id');           
                    break;
                }
                
            }   
        }
	this.initToggle();
        if(autoplay)
            this.loadNextSong();
    });
}

function PlayerControl.prototype.onYouTubePlayerReady(event) {
    if(initialized)
        return;
    
    if(event.target!=null) {
        ytplayer = event.target;
        this.embed_method=METHOD.HTML5;   
    } else {
        ytplayer = document.getElementById(event);
        ytplayer.addEventListener("onStateChange", "playerStateChange");    
        ytplayer.addEventListener("onError","playerStateError");
        this.embed_method=METHOD.FLASH;
    } 
    initialized=true;
}

function PlayerControl.prototype.playerStateError(event) {
    if(embed_method==METHOD.HTML5)
        state = event.data;
    else 
        state = event;
             
    /**    
    2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
    5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.<strong></strong>
    100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
    101 – The owner of the requested video does not allow it to be played in embedded players.
    150 – This error is the same as 101. It's just a 101 error in disguise!
    **/
    if(state!=5) {
        this.loading_error=true;
        this.loadNextSong();
    }  
}

function PlayerControl.prototype.playerStateChange(event) {
    if(embed_method==METHOD.HTML5)
        state = event.data;
    else 
        state = event;
        
    /**    
        -1 (unstarted)
        0 (ended)
        1 (playing)
        2 (paused)
        3 (buffering)
        5 (video cued).
    **/ 
    
    if(state=='0') //||(state=='-1'&&loading_error))    
        this.loadNextSong();         
    else     
    {
        if(this.current_playlist==PLAYLIST.DEFAULT) {      
            if(state=='1') { 
                if(this.default_imagecell!=null) {	    
                    while(this.default_imagecell.firstChild) {
			this.default_imagecell.removeChild(this.default_imagecell.firstChild);                    
		    }                        
                    this.default_imagecell.appendChild(this.image_equalizer);		    
                }                
		
                charts_startTimer(ytplayer.getDuration());                                    
            }                            
                        
        } else if(this.current_playlist==PLAYLIST.CHARTS) {
            if(state=='1') {             
                if(this.charts_imagecell!=null) {
                    while(this.charts_imagecell.firstChild)
                        this.charts_imagecell.removeChild(this.charts_imagecell.firstChild);
                    this.charts_imagecell.appendChild(this.image_equalizer);                    
                }            
                               
                charts_startTimer(player.getDuration());
            }
             
                
        } else if(current_playlist==PLAYLIST.CUSTOM) {
            if(state=='1') {             
                if(this.custom_imagecell!=null) {     
		    $(this.custom_imagecell).html();
		    $(this.custom_imagecell).html(this.image_equalizer)            
                }
                             
                charts_startTimer(ytplayer.getDuration());
            }
                
        }
        
        loading_error=false;        
    }
}

function PlayerControl.prototype.loadSongCharts(elem) {
    if(this.charts_imagecell!=null) {
        row = charts_imagecell.parentNode;
        cells = row.getElementsByTagName('td');        
        index = Array.prototype.indexOf.call(row.parentNode.childNodes, row);
        cells[0].innerHTML = (index+1);
        for(i=0;i<cells.length;i++) {
		cells[i].style.fontWeight='';
	}
    }

    
    cells = elem.children('td');
    this.charts_imagecell   = cells.get(0);
    this.charts_imagecell.innerHTML='<img src="./images/progress.gif" height="15px" style="display:inline;z-index:1000;position:relative;text-align:center;vertical-align:middle;" />&nbsp;';
    
    
    for(j=0;j<cells.length;j++) {
	$(cells.get(j)).css('fontWeight','bold');   
    }
        
    this.loadMovie(elem);
}

function PlayerControl.prototype.loadSongPlaylist(elem) {
    if(default_imagecell!=null) {
        default_imagecell.innerHTML='&nbsp';
        cells = default_active_row.getElementsByTagName('div');
        for(i=0;i<cells.length;i++) {
		cells[i].style.fontWeight='';
	}
    }

    cells = elem.children('div');
    this.default_imagecell   = cells.get(0);
    this.default_active_row  = default_imagecell.parentNode;
    this.default_imagecell.innerHTML='<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';
    

    
    for(j=0;j<cells.length;j++) {
	$(cells.get(j)).css('fontWeight','bold');  
    }  
        
    this.loadMovie(elem);
}

function PlayerControl.prototype.playlist_user_loadNextSong() {
    rows        = $(".user_entry");        
    
    if(custom_imagecell!=null) {
        this.custom_active_row       = custom_imagecell.parentNode;
        custom_active_index     = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==this.custom_active_row) {
                custom_active_index=i;
                break;
            }
        }
        
        if((custom_active_index+1)>=rows.length)
                custom_active_index=0;                    
	else
		custom_active_index++;
    } else
        custom_active_index = 0;
    
    songelem = rows.get(custom_active_index);    
    this.loadSong($(songelem));   
}

function PlayerControl.prototype.loadPrevSongUser() {
    rows        = $(".user_entry");        
    
    if(custom_imagecell!=null) {
        this.custom_active_row       = custom_imagecell.parentNode;
        custom_active_index      = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==this.custom_active_row) {
                custom_active_index=i;
                break;
            }
        }
        if((custom_active_index-1)<0)
                custom_active_index=0;                    
	else
                custom_active_index--;
    } else
        custom_active_index = 0;
    
    songelem = rows.get(custom_active_index);    
    this.loadSong($(songelem));   
}

function PlayerControl.prototype.loadPrevSongPlaylist() {
    rows        = $("div.track_row");        
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 
    
    if(default_imagecell!=null) {
        activerow   = this.default_active_row;   
        activeindex = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==activerow) {
                activeindex=i;
                break;
            }
        }
        
        /**
            TODO: implement 
            loading previous page... 
        */
        if((activeindex-1)<0)
            activeindex=0;    
        else
            activeindex--;
        
        activecells = activerow.getElementsByTagName('div');
        for(i=0;i<activecells.length;i++)
            activecells[i].style.fontWeight='';    
        this.default_imagecell.innerHTML='&nbsp;';
        
    }
    else
        activeindex=0;
       
    songelem = rows[activeindex];
    cells = songelem.getElementsByTagName('div');

            
    cells[0].innerHTML='<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';
           
    for(j=0;j<cells.length;j++)
        cells[j].style.fontWeight='bold'; 
        
    this.default_imagecell   = cells[0];  
    this.default_active_row  = default_imagecell.parentNode;
    
    this.loadMovie(songelem);
}

function PlayerControl.prototype.loadPrevSongCharts() {
    rows        = $(".charts_entry");        
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 
    
    if(this.charts_imagecell!=null) {
        this.charts_active_row       = charts_imagecell.parentNode;
        charts_activeindex      = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==this.charts_active_row) {
                charts_activeindex=i;
                break;
            }
        }
        if((charts_activeindex-1)<0)
                charts_activeindex=0;                    
	else
                charts_activeindex--;
    }
    else
        charts_activeindex = 0;
    
    songelem = rows.get(charts_activeindex);
    
    this.loadSong($(songelem));   
}

function PlayerControl.prototype.loadSongUser(elem) {
    if(this.custom_imagecell!=null) {
        row = custom_imagecell.parentNode;
        cells = row.getElementsByTagName('td');        
        index = Array.prototype.indexOf.call(row.parentNode.childNodes, row);
        cells[0].innerHTML = (index+1);
        for(i=0;i<cells.length;i++)
            cells[i].style.fontWeight='';
    }

    
    cells = elem.children('td');
    this.custom_imagecell   = cells.get(0);
    this.custom_imagecell.innerHTML='<img src="./images/progress.gif" height="15px" style="display:inline;z-index:1000;position:relative;" />&nbsp;';
    
    for(j=0;j<cells.length;j++)
        $(cells.get(j)).css('fontWeight','bold');    
        
    this.loadMovie(elem);
}

function PlayerControl.prototype.loadSong(elem) {        
    if(this.current_playlist==PLAYLIST.DEFAULT)
        this.loadSongPlaylist(elem);
    else if(this.current_playlist==PLAYLIST.CHARTS)
        this.loadSongCharts(elem);
    else if(this.current_playlist==PLAYLIST.CUSTOM)
        this.loadSongUserList(elem);
}

function PlayerControl.prototype.setPlaylist(newplaylist) {

    if(this.current_playlist==newplaylist)
        return;
        
    if(this.current_playlist==PLAYLIST.DEFAULT) {
        if(this.default_imagecell!=null) {
            this.default_imagecell.innerHTML='&nbsp;';
            //row = imagecell.parentNode;
            $(default_active_row).find('div').css('font-weight','');
        }
                
    }
    else if(this.current_playlist==PLAYLIST.CHARTS) {
        if(charts_imagecell!=null) {	
            rows        = $(".charts_entry");       
            
            this.charts_active_row       = charts_imagecell.parentNode;                        
            charts_activeindex      = -1;
            for(i=0;i<rows.length;i++) {
                if(rows[i]==this.charts_active_row) {
                    charts_activeindex=i;
                    break;
                }
            }
	    
            this.charts_imagecell.innerHTML=(charts_activeindex+1);
            $(charts_active_row).find('td').css('font-weight','');            
        }
    }
    
    else if(this.current_playlist==PLAYLIST.CUSTOM) {
        if(this.custom_imagecell!=null) {
            rows = $(".user_entry");
            
            this.custom_active_row       = custom_imagecell.parentNode;                        
            custom_active_index     = -1;
            for(i=0;i<rows.length;i++) {
                if(rows[i]==this.custom_active_row) {
                    custom_active_index=i;
                    break;
                }
            }
            this.custom_imagecell.innerHTML=(custom_active_index+1);
            $(custom_active_row).find('td').css('font-weight','');  
        }
    }
    
    
    this.current_playlist = newplaylist;
}

function PlayerControl.prototype.setCurrentPlay(elem) {
    if(elem.nodeName.toUpperCase()=='div'.toUpperCase()) {
        cells = elem.getElementsByTagName('div');        
        this.default_imagecell=cells[0];
	for(j=0;j<cells.length;j++) cells[j].style.fontWeight='bold'; 
        this.default_active_row=default_imagecell.parentNode;
    }    
}

function PlayerControl.prototype.loadNextPage(autoplay) {
    if(this.active_page<this.all_pages)
        this.active_page++;
    else
        this.active_page=1;
    
    this.loadPlaylist(this.active_page,'playlistdata',autoplay);   
    $("#pagefield").val(this.active_page);
}

function PlayerControl.prototype.loadPrevPage(autoplay)
{
    if(active_page>all_pages)
        this.active_page=1;
    else if(active_page<=1)
        this.active_page = all_pages;        
    else
        this.active_page--;
    
    loadPlaylist(this.active_page,'playlistdata',autoplay);   
    $("#pagefield").val(this.active_page);
}

function PlayerControl.prototype.loadNextSongCharts() {
    rows        = $(".charts_entry");        

    if(this.charts_imagecell!=null) {
        this.charts_active_row       = this.charts_imagecell.parentNode;
        charts_activeindex      = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==this.charts_active_row) {
                charts_activeindex=i;
                break;
            }
        }
        if((charts_activeindex+1)>=rows.length)
                charts_activeindex=0;                    
	else
                charts_activeindex++;
    }
    else
        charts_activeindex = 0;
    
    songelem = rows.get(charts_activeindex);
    
    this.loadSong($(songelem));      
}

function PlayerControl.prototype.loadNextSongPlaylist() {
    rows        = $("div.track_row");        
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 
    
    if(this.default_imagecell!=null) {
        
        activerow   = this.default_active_row;   
        activeindex = -1;
        for(i=0;i<rows.length;i++) {
            if(rows[i]==activerow) {
                activeindex=i;
                break;
            }
        }
        
        if((activeindex+1)>=rows.length) {            
            this.loadNextPage(true);
            return; 
        } else
            activeindex++;
        
        activecells = activerow.getElementsByTagName('div');
        for(i=0;i<activecells.length;i++)
            activecells[i].style.fontWeight='';    
        this.default_imagecell.innerHTML='&nbsp;';
        
    }
    else
        activeindex=0;
       
    songelem = rows[activeindex];

    cells = songelem.getElementsByTagName('div');

            
    cells[0].innerHTML='<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';    
           
    for(j=0;j<cells.length;j++)
        cells[j].style.fontWeight='bold'; 
    
    this.default_imagecell   = cells[0];
    this.default_active_row  = default_imagecell.parentNode;    
    
    this.loadMovie(songelem);    
}

function PlayerControl.prototype.loadPrevSong() {
    if(current_playlist==PLAYLIST.DEFAULT)
        this.loadPrevSongPlaylist();
    else if(current_playlist==PLAYLIST.CHARTS)
        this.loadPrevSongCharts();
    else if(current_playlist==PLAYLIST.CUSTOM)
        this.loadPrevSongUser();
}

function PlayerControl.prototype.loadNextSong() {          
    if(current_playlist==PLAYLIST.DEFAULT)
        this.loadNextSongPlaylist();
    else if(current_playlist==PLAYLIST.CHARTS)
        this.loadNextSongCharts();
    else if(current_playlist==PLAYLIST.CUSTOM)
        this.loadNextSongUser();
}

function PlayerControl.prototype.activeRow(elem) {
    this.active_row = elem;
}

function PlayerControl.prototype.inactiveRow(elem) {
    this.active_row = null;
}

function PlayerControl.prototype.loadPage(textfield_id,playlist_id,maxpages) {
    textfield = document.getElementById(textfield_id);
    
    if(isNaN(textfield.value)||textfield.value==active_page||textfield.value>maxpages||textfield.value<=0||loadPage_active)
    {
        if(!loadPage_active)
            textfield.value=curpage;        
        return;
    }

    this.loadPlaylist(textfield.value,playlist_id,false);    
}

function PlayerControl.prototype.getCurrentVideoID() {
    video_url = ytplayer.getVideoUrl();     
    video_arr  = video_url.split('?')[1];
    video_arr  = video_arr.split('&');
    for(cnt=0;cnt<video_arr.length;cnt++) {
        keyval = video_arr[cnt].split('=');        
        for(cnt2=0;cnt2<keyval.length;cnt2++) {
            if(keyval[cnt2]=='v'&&keyval.length>(cnt2+1))
                return keyval[cnt2+1];
        }
    }
    
    return 'unknown';
}

function PlayerControl.prototype.volumeUp(vol) {
    if(ytplayer!=null) {
        oldvol = Math.floor(ytplayer.getVolume());
        newvol = oldvol+vol;
        if(newvol>100)
            newvol=100;
        if(ytplayer.isMuted()) {
            ytplayer.setVolume(vol);    
            ytplayer.unMute();
            return;
        }

        ytplayer.setVolume(newvol);
    }
}

function PlayerControl.prototype.volumeDown(vol) {
    if(ytplayer!=null) {
        oldvol = Math.floor(ytplayer.getVolume());
        newvol = oldvol-vol;
        if(newvol<0)
            newvol=0;
            
        ytplayer.setVolume(newvol);
    }
}

function PlayerControl.prototype.rewind(sec,ahead) {
    if(ytplayer!=null) {
        curtime = player.getCurrentTime();
        newtime = curtime-sec;
        if(newtime<0)
            newtime=0;
        ytplayer.seekTo(newtime,ahead);
    }
}

function PlayerControl.prototype.fastForward(sec,ahead) {
    if(ytplayer!=null) {
        curtime = ytplayer.getCurrentTime();
        newtime = curtime+sec;
        ytplayer.seekTo(newtime,ahead);
    }
}

function PlayerControl.prototype.togglePause() {
    if(ytplayer!=null) {
        state = ytplayer.getPlayerState();
        if(state==YT.PlayerState.PAUSED)
            ytplayer.playVideo();
        else if(state==YT.PlayerState.PLAYING)
            ytplayer.pauseVideo();
    }
}