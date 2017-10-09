//copyright 2013 by Jonny Rimkus a.k.a Ravermeister
var userlist_selected_row = null;
var userlist_cookie_loaded = false;




function userlist_setActiveRow(row) {
    userlist_selected_row = row;
}

function userlist_clearPlaylist()
{
    if(userlist_selected_row!=null)
    {
        $.ajax(
            './php/user_playlist.php?action=clear',
            {
                type : 'GET',
                dataType : 'json'
            }
        ).done(function(response){
            userlist_generatePlaylist(response);
            setPlaylist(PLAYLIST.DEFAULT);
            userlist_selected_row = null;     
        });
        
        
    }     
}
function userlist_updatePlaylist()
{
    tbody = $("#user_list").find('tbody');    
    rows = tbody.find('tr');
    trackdata = new Array();
    
    $(rows).each(function(cnt){
        
        data = $(this).find('td');
        entry = new Object();                        
        entry.artist   = $(data.get(1)).text();
        entry.title    = $(data.get(2)).text();
        trackdata[cnt] = entry;
    });
    
    
    $.ajax(
        './php/user_playlist.php?action=update',
        {
            type : 'POST',
            dataType : 'json',
            data : {
                'playlist' : trackdata,
            }
        }
    );
}

function userlist_removeFromPlaylist() {
    active_row=null;
    if(custom_imagecell!=null) {
	active_row       = custom_imagecell.parentNode;                        
    }

    if(userlist_selected_row!=null) {
        data                =  userlist_selected_row.find('td');
	
        trackinfo           = new Object();
	trackinfo.nr        = $(data.get(0)).text();
        trackinfo.artist    = $(data.get(1)).text();
        trackinfo.title     = $(data.get(2)).text(); 
	if(active_row!=null&&$(active_row).index()==$(userlist_selected_row).index()) {
		trackinfo.nr        = $(active_row).index()+1;
		custom_imagecell = null;	
		custom_active_row = null;
	}
	
        $.ajax(
            './php/user_playlist.php?action=remove',
            {
                type : 'POST',
                dataType : 'json',
                data : {
                    'trackdata' : trackinfo,
                }
            }
        ).done(function(response){
            userlist_generatePlaylist(response);     
        });
    }    
    
    
}
function userlist_loadStoredPlaylist()
{
    if(userlist_cookie_loaded )
        return false;    
        
    data = $.cookie('music_userlist');
    if(data==undefined)
        return false;
    
            
    
    saved_playlist = JSON.parse(data);        
    userlist_generatePlaylist(saved_playlist);    
    
    userlist_cookie_loaded = true;    
    return true;
}
function userlist_addToPlaylist(trackinfo) {    
	//console.log(trackinfo);
    $.ajax(
        './php/user_playlist.php?action=add',
        {
            type : 'POST',
            dataType : 'json',
            data : {
                'trackdata' : trackinfo,
            }
        }
    ).done(function(response){
        userlist_generatePlaylist(response);
        
        /**
         * why does this not work???
         */        
//        tbody = $("#user_list tbody");
//        ltr = $("#user_list tbody tr").last();
//        ltr = ltr[0];
//        tbody = tbody[0];        
//        scrollIntoView(ltr, tbody);
    });
}


function userlist_loadPlaylist()
{    
    $.ajax(
        './php/user_playlist.php?action=list',
        {
            type : 'POST',
            dataType : 'json'
        }
    ).done(function(response){
    	userlist_generatePlaylist(response);   
    });   
    
}

function userlist_savePlaylist()
{
    container = $("#user_list");    
    rows = container.find('tr');
    
    trackdata = new Array();
    
    for(cnt=1;cnt<rows.length;cnt++)
    {
        rowdata = $(rows[cnt]).find('td');
        
        track = new Object();        
        track.artist = $(rowdata.get(1)).text();
        track.title = $(rowdata.get(2)).text();
        
        trackdata[cnt-1] = track;
    }
    $.cookie('music_userlist', JSON.stringify(trackdata),{expires : 90});
    
    cookiestring = $.cookie('music_userlist');
}

function userlist_generatePlaylist(trackdata) {
       if(custom_imagecell!=null) {
            custom_active_row   = custom_imagecell.parentNode;
            custom_table        = custom_active_row.parentNode;
            custom_active_index = $(custom_active_row).index();               
       }
       
       table        = document.createElement('table');
       table.id     = 'sort';
       table.setAttribute('class', 'pure-table pure-table-horizontal');
       //table.style.width='100%';
       //table.style.heiht='100%';
       
       thead        = document.createElement('thead');
       table.appendChild(thead);
              
       row          = document.createElement('tr');
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('userplaylist.header.nr','locale',locale)

       row.appendChild(rowdata);
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('userplaylist.header.artist','locale',locale)
 
       row.appendChild(rowdata);
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('userplaylist.header.title','locale',locale)

       row.appendChild(rowdata);
         
       thead.appendChild(row);
       tbody    = document.createElement('tbody');
       for(cnt=0;cnt<trackdata.length;cnt++) {
           row          = document.createElement('tr');
           row.className = row.className + ' user_entry';
           
           if(custom_active_row!=null&&custom_active_index==cnt)           
                custom_active_row = row;
           
           rowdata      = document.createElement('td');
           
           if(custom_active_row!=null&&custom_active_index==cnt)
           {
                rowdata.innerHTML   = custom_imagecell.innerHTML;
                custom_imagecell    = rowdata;
           }           
                
           else
                rowdata.innerHTML = (cnt+1);
                 
           rowdata.className = rowdata.className + 'user_data index';

           if(custom_active_row!=null&&custom_active_index==cnt) {
		rowdata.style.fontWeight = 'bold';
	   }
                
           row.appendChild(rowdata);
           
           rowdata      = document.createElement('td');
           rowdata.innerHTML = trackdata[cnt].artist;       
           rowdata.className = rowdata.className + 'user_data';
 
           if(custom_active_row!=null&&custom_active_index==cnt)
                rowdata.style.fontWeight = 'bold';
           row.appendChild(rowdata);
           
           rowdata      = document.createElement('td');
           rowdata.innerHTML = trackdata[cnt].title;  
           rowdata.className = rowdata.className + 'user_data'; 

           if(custom_active_row!=null&&custom_active_index==cnt)
                rowdata.style.fontWeight = 'bold';
           row.appendChild(rowdata);
           
           $(row).mouseover(function(){
                userlist_setActiveRow($(this));
           });
           
           
           $(row).click(function(){
                setPlaylist(PLAYLIST.CUSTOM);
                loadSong($(this));
           });
           
           tbody.appendChild(row);	   
       }
       table.appendChild(tbody);

       
       user_playlist_save_button  = document.createElement('input');
       user_playlist_save_button.type = 'button';
       user_playlist_save_button.value = messageResource.get('userplaylist.button.save','locale',locale)
       user_playlist_save_button.setAttribute('style','margin-top: 10px;');
       user_playlist_save_button.setAttribute('class','pure-button');
               
       $(user_playlist_save_button).click(function(){
            userlist_savePlaylist();
       });
       
       $("#user_list").ready(function(){
		
		userlist = $("#user_list");
		userlist.html('');
		userlist.append(table);
		elem = $("#user_list tbody");

		elem.sortable({     
			containment: userlist,
			cursor: 'move',
			helper: function(e, tr) {
				var $originals = tr.children();
				var $helper = tr.clone();
				$helper.addClass('dragelem');
				$helper.children().each(function(index) {
					$(this).width($originals.eq(index).width());
					$(this).addClass('dragelem');
				});
				return $helper;
			},			
			start: null,
			stop: function(e, ui) {
				$('td.index', ui.item.parent()).each(function (i) {

				image = this.firstChild;
				if(image.tagName==undefined||image.tagName.toUpperCase()!='IMG')
				    $(this).html(i + 1);
				});
				userlist_updatePlaylist();
			}
			
		}).disableSelection(); 
		
		userlist.droppable({
			accept: '#charts_list tbody tr, #playlistdata .track_row',
			tolerance: 'intersect',
			classes: {
				"ui-droppable": "highlight"
			},
			drop: function( event, ui ) {
				
				if(ui.helper.length==0) return;
				elem = $(ui.helper[0]);
				
				//console.log($(elem).attr('class'));
				if($(elem).hasClass('charts_entry')) {
					artist = $(elem).find('td:nth-child(2)').text();
					title = $(elem).find('td:nth-child(3)').text();
				} else if($(elem).hasClass('track_row')){
					artist = $(elem).find('td:nth-child(3)').text();
					title = $(elem).find('td:nth-child(4)').text();					
				}
				//console.log('artist: '+artist+' | title: '+title);
				
				trackdata = new Object();
				trackdata.artist = artist;
				trackdata.title  = title;
				
				userlist_addToPlaylist(trackdata);
			
			}
		});
		//drag n drop
		userlist.append(user_playlist_save_button);
	});
	

}


