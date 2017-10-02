//copyright 2013 by Jonny Rimkus a.k.a Ravermeister

chartcounter_active       = true;
charts_selected_row       = null;
current_track             = null;


function charts_setActive(state) {
    chartcounter_active = state;
}

function charts_setCurrentTrack(trackdata) {
    if(current_track==null||current_track.title!=trackdata.title||current_track.artist!=trackdata.artist) {
        current_track           = trackdata;
        current_track.timer     = null;    
    }  
}

function charts_startTimer(tracklength) {
    
    /**
    * timer length half of the track 
    * or maximum 2 minutes
    **/
    timeout = parseInt(tracklength/2);
    if(timeout>120)
        timeout=120;
    timeout = timeout*1000;
    
    timeout = 3000; //testing

    //console.log('chartcounter_active: '+((chartcounter_active==true) ? 'true' : 'false')+' | current_track.timer: '+ current_track.timer);
    if(chartcounter_active&&current_track.timer==null) {
        
        /**
        * TODO: user the custom Timer() function, 
        * sothat it is possible to stop the chart timer when
        * pause. means youtube player is not playing
        */
        
        /*
        charts_save_timer = new Timer(function(){
            charts_saveTrack(current_track);
        },timeout);
        */
        var now_playing        = new Object();
        now_playing.artist = current_track.artist;
        now_playing.title  = current_track.title;
        chart_timer = setTimeout(function(){
	    //console.log('saving track: '+now_playing.artist+' - '+now_playing.title+'  Timer: '+current_track.timer);
            charts_saveTrack(now_playing);
        },timeout);
        current_track.timer = chart_timer;
        //console.log('starting timer for: '+now_playing.artist+' - '+now_playing.title+'  Timer: '+current_track.timer+' Timeout: '+timeout/1000+' sec.');                 
    }
}

function charts_saveTrack(myTrack) {
    //console.log(myTrack.artist+'<>'+current_track.artist);
    //console.log(myTrack.title+'<>'+current_track.title);
    if(myTrack.artist==current_track.artist && myTrack.title==current_track.title) {
        $.ajax({
            type: "POST",
            url: "./php/charts.php",
            data: {
                    'track' : myTrack,
                    'action': 'add'
            }
        }).done(function(response){	
		    //console.log('Chart Timer Saved Track: '+myTrack.artist+' - '+myTrack.title + 'current song timer: '+current_track.timer);
		    //console.log('response: '+response);
	        charts_load();
        });

    } else {
        //console.log('Chart Timer Skipped Track: '+myTrack.artist+' - '+myTrack.title);
        //console.log('because now playing: '+current_track.artist+' - '+current_track.title);
        //charts_load();
    }
        
      
      
    //current_track.timer = null;
}

function charts_load() {
    
    $.ajax({
        type: "POST",
        url: "./php/charts.php",
        dataType: 'json',
        data: {
                'action': 'show'                
        }
        
    }).done(function(response){
    	console.log('inside charts load');
        //chartlist = $.parseJSON(response);
        chartlist    = response;
                                 
        table        = document.createElement('table');
        table.setAttribute('class', 'pure-table');
            
        thead        = document.createElement('thead');
        tbody        = document.createElement('tbody');
        row          = document.createElement('tr');
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        rowdata      = document.createElement('td');
        rowdata.setAttribute('style','width: 5%;')
        rowdata.innerText = messageResource.get('charts.header.nr','locale',locale);  
        row.appendChild(rowdata);
        
        rowdata      = document.createElement('td');
        rowdata.innerText = messageResource.get('charts.header.artist','locale',locale);  
        row.appendChild(rowdata);
        
        rowdata      = document.createElement('td');
        rowdata.innerText = messageResource.get('charts.header.title','locale',locale);  
        row.appendChild(rowdata);
        
        rowdata      = document.createElement('td');
        rowdata.setAttribute('style','width: 8%;')
        rowdata.innerText = messageResource.get('charts.header.playcount','locale',locale);  
        row.appendChild(rowdata);
        
        thead.appendChild(row);
            
        active_track = null;
        charts_active_row = null;
        charts_active_data = null;
        
        
        if(charts_imagecell!=null) {
            charts_active_row = charts_imagecell.parentNode;            
            active_data = $(charts_active_row).find('td');
            active_track = new Object();
            $(active_data.get(0)).setAttribute('style','width: 5%');
            $(active_data.get(3)).setAttribute('style','width: 8%');
            
            active_track.artist = $(active_data.get(1)).text();
            active_track.title = $(active_data.get(2)).text();            
        }                
        for(cnt=0;cnt<chartlist.length;cnt++) {                
            if(
                active_track!=null&&
                active_track.artist==chartlist[cnt].interpret&&
                active_track.title==chartlist[cnt].title
               ) {
                    $(active_data.get(3)).text(chartlist[cnt].playcount);
                    table.appendChild(charts_active_row);
                    continue;
               }
            
            row = document.createElement('tr');
            row.className = row.className + 'charts_entry';
            $(row).click(function(){
                setPlaylist(PLAYLIST.CHARTS);
                loadSong($(this));
            });
    	        
                         
            
            rowdata = document.createElement('td');   
            rowdata.setAttribute('style','width: 5%;')
            //rowdata.innerHTML = '<input type="hidden" id="videoId" value="'+chartlist[cnt].videoId+'" />'+(cnt+1);  
            rowdata.innerHTML = (cnt+1);
            rowdata.className = rowdata.className + 'charts_data'; 
            row.appendChild(rowdata);   
            
            rowdata = document.createElement('td');                        
            //rowdata.innerHTML = htmlDecode(chartlist[cnt].interpret);
            rowdata.innerHTML = chartlist[cnt].interpret;  
            rowdata.className = rowdata.className + 'charts_data';           
            row.appendChild(rowdata);            
            rowdata = document.createElement('td');
            //rowdata.innerHTML = htmlDecode(chartlist[cnt].title);
            rowdata.innerHTML = (chartlist[cnt].title);
            rowdata.className = rowdata.className + 'charts_data';        
            row.appendChild(rowdata);
            
            rowdata = document.createElement('td');
            rowdata.setAttribute('style','width: 8%;')
            rowdata.innerHTML = chartlist[cnt].playcount;  
            rowdata.className = rowdata.className + 'charts_data'; 
            row.appendChild(rowdata);     
            
            $(row).mouseover(function(){
                charts_setActiveRow($(this));
            });                        
            
            tbody.appendChild(row);
        }

    	charts = $("#charts_list");
    	charts.html('');
    	charts.append(table);
    	elem = $("#charts_list tbody tr");	
    	elem.draggable({    
    		revert: false,
    		cursor: 'move',
    		helper: function() {
    			
    			var $originals = $(this).children();
    			var $helper = $(this).clone();

    			//$helper.css('background','lightblue');
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
    	
    	//drag n drop
        
        if(charts_active_row!=null) {
        	//scrollIntoView(charts_active_row,charts_container);
        }
    });
}


function charts_setActiveRow(row) {
    charts_selected_row = row;
}

function charts_addToPlaylist() {
    if(charts_selected_row!=null) {
        data = $(charts_selected_row).find('td');
        trackdata = new Object();
        trackdata.artist = $(data.get(1)).text();
        trackdata.title  = $(data.get(2)).text();
        
        userlist_addToPlaylist(trackdata);
    }
}













//Helper functions

function Timer(fn, countdown) {
    var ident, complete = false;

    function _time_diff(date1, date2) {
        return date2 ? date2 - date1 : new Date().getTime() - date1;
    }

    function cancel() {
        clearTimeout(ident);
    }

    function pause() {
        clearTimeout(ident);
        total_time_run = _time_diff(start_time);
        complete = total_time_run >= countdown;
    }

    function resume() {
        ident = complete ? -1 : setTimeout(fn, countdown - total_time_run);
    }

    var start_time = new Date().getTime();
    ident = setTimeout(fn, countdown);

    return { cancel: cancel, pause: pause, resume: resume };
}


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
