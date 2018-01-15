//copyright 2013 by Jonny Rimkus a.k.a Ravermeister 

var selected_row = false;
var custom_video_active = false;
var custom_video_default_textval = 'youtube video id...';

if(typeof cmenutheme === 'undefined') {
	cmenutheme = 'default';
}
var cmenu_default_base_options =
{  
  // true|false to turn the menu shadow on or off  
  shadow:false,  
    
  // The shadow offset to use for both X and Y. If this is set, it overrides  
  // The individual X and Y values  
  shadowOffset:0,  
    
  // The number of pixels to offset the shadow to the right/downwards   
  // (this can be negative)  
  shadowOffsetX:5,  
  shadowOffsetY:5,  
    
  // The shadow will by default be the size of the menu. These values adjust   
  // that size to make the shadow larger or smaller. The default value here   
  // of -3 looks best.  
  shadowWidthAdjust:-3,  
  shadowHeightAdjust:-3,  
    
  // How transparent the shadow is  
  shadowOpacity:.2,  
    
  // The class to apply to the created DIV object that will be the shadow  
  shadowClass:'context-menu-shadow',  
    
  // The color of the shadow  
  shadowColor:'black',  
  
  // The number of pixels to move the menu left/down from where the mouse clicked  
  offsetX:0,  
  offsetY:0,  
    
  // The jQuery selector to use to choose which DOM element to attach the menu to  
  appendTo:'body',  
    
  // The direction (up|down) the menu will display  
  direction:'down',  
    
  // Keep the menu within the visible area of the screen. If the menu would go   
  // off the left or the bottom, it will be pushed left and/or displayed   
  // upwards rather than downwards.  
  constrainToScreen:true,  
  
  // The jQuery transitions to use for showing and hiding the menu  
  showTransition:'show',  
  hideTransition:'hide',  
    
  // The speed to use for transitions - slow/normal/fast/#ms  
  showSpeed:'normal',  
  hideSpeed:'normal',  
    
  // Function to run after the show/hide transitions have completed  
  showCallback:null,  
  hideCallback:null,  
  
  // CSS class names to apply to the generated menu HTML.   
  // See http://www.JavascriptToolbox.com/lib/contextmenu/#themes  
  className:'context-menu',  
  itemClassName:'context-menu-item',  
  itemHoverClassName:'context-menu-item-hover',  
  disabledItemClassName:'context-menu-item-disabled',  
  disabledItemHoverClassName:'context-menu-item-disabled-hover',  
  separatorClassName:'context-menu-separator',  
  innerDivClassName:'context-menu-item-inner',  
  // The class name prefix to prepend to the theme name for css styling  
  themePrefix:'context-menu-theme-',  
    
  // Theme name. Included themes are: 'default','xp','vista','osx','human','gloss'  
  // Multiple themes may be applied with a comma-separated list.  
  theme:cmenutheme,
  
  beforeShow : function() {
		resetVars();
		loadDynamicMenu($(this.menu));
	}  
}  
 


var cmenu_default_base_menu = 
[
    {'close Menu' : 
        {
            onclick: function(menuItemClicked,menuObject){return true},
            icon: './images/Xion_24.png'
        }
    },
    
    {'reset Youtube Video ID' : 
        {
            className: 'delete_alternative',
            onclick: function(menuItemClicked,menuObject){deleteAlternative(); return false;},
            icon: './images/Recycle_24.png'                    
        }
    },
    
    {'enter Youtube Video ID' :
        {
            onclick: function(menuItemClicked,menuObject){
                if(custom_video_active)
                    return false;
                
                custom_video_active = true;
                enterVideoID(menuObject, custom_video_default_textval);
                return false;
            },
            
            icon: './images/Paint_24.png',
            className: 'custom_video_menu'          
        }       
    },
    
    {'add to Playlist' :
        {
            onclick: 
            function(menuItemClicked,menuObject){
                cells = selected_row.children('td');
                trackinfo           = new Object();
                trackinfo.artist    = $(cells.get(2)).text();
                trackinfo.title     = $(cells.get(3)).text(); 		
                userlist_addToPlaylist(trackinfo);
                return true;
            },
            icon: './images/Music_24.png'
        }
    },
    
    $.contextMenu.separator,    
    {'&nbsp;' :
        {
            className: 'dynamic_menu_loader'
        } 
    },    
    
];






///////////////////////// functions

function resetVars(){
	
	selected_row=false; 
	selected_row=$(active_row); 
	custom_video_active = false;
	
	cells = selected_row.children('td');
	needle = $(cells.get(2)).text()+' '+$(cells.get(3)).text();
	request_url='./php/edit_env_vars.php?action=get&key='+needle;
	$.ajax(request_url,{
		dataType : 'text'        
	}).done(function(response){		
		video_id = response;
		custom_video_active = true;
		if(video_id == '')  video_id = custom_video_default_textval;		
		enterVideoID($('.custom_video_menu'), video_id);		
	});

}
    
function loadDynamicMenu(cmenu) {
    if(active_row==null) return;

    selected_row.parent().children('td').css('cursor','wait');
	
    cells = selected_row.children('td');
    needle = $(cells.get(2)).text()+' '+$(cells.get(3)).text();
    //console.log(needle);
    
	request_url='./php/do_search.php?needle='+encodeURIComponent(needle)+'&listsize='+25;
    
    
    item_loader = cmenu.find('.dynamic_menu_loader');
    item_delete = cmenu.find('.delete_alternative');
    
    
    dyn_items = cmenu.find('.dynamic_menu');
    dyn_items.remove();
            
    $(item_loader).css('display','block');
    //$(item_delete).addClass('context-menu-item-disabled');
    
    $.ajax(request_url,{
        dataType : 'json'        
    }).done(function(response){      
        items = new Array();
        current_video = getCurrentVideoID();        
        for(cnt=0;cnt<response.length;cnt++) {
            div_container = document.createElement('div');
            $(div_container).addClass('context-menu-item');
            $(div_container).addClass('dynamic_menu');
            $(div_container).mouseover(function(){$(this).addClass('context-menu-item-hover')})
            $(div_container).mouseout(function(){$(this).removeClass('context-menu-item-hover')})
            div_item  =  document.createElement('div');
            $(div_item).addClass('context-menu-item-inner');
            
            title         = response[cnt].title;
            //title       = decodeURIComponent(response[cnt].title);
            //title       = htmlDecode(title);
        
            if(response[cnt].video_id==current_video) {
			title   = '* '+title;
			$(div_item).css('font-style','italic');       
            }                            
                                            
            $(div_item).text((cnt+1)+'. '+title);            
            $(div_item).css('background-image','url(./images/iTunes_24.png)');            
            $(div_item).click({'needle': needle, 'videoId' : response[cnt].video_id },setAlternative);    
                                
                    
                    
            $(div_container).append(div_item);
            items[cnt] = $(div_container);                                                
        }
        if(response.length>0) {
            //$(item_delete).removeClass('context-menu-item-disabled');
            //$(item_delete)
            $(item_loader).css('display','none');            
            $(item_loader).after(items);   
        }    else {
            div_container = document.createElement('div');
            $(div_container).addClass('context-menu-item');
            $(div_container).addClass('dynamic_menu');
            $(div_container).mouseover(function(){$(this).addClass('context-menu-item-hover')})
            $(div_container).mouseout(function(){$(this).removeClass('context-menu-item-hover')})
            div_item  =  document.createElement('div');
            $(div_item).addClass('context-menu-item-inner');
            $(div_item).html('<center>Nichts Gefunden!</center>');
            
            $(div_container).append(div_item);
            $(div_container).css('padding-top','10px');
            $(div_container).css('padding-bottom','10px');
            $(item_loader).css('display','none');
            $(item_loader).after(div_container); 
            //cmenu.hide();
        }        
            
        
                 
        selected_row.parent().children('div').css('cursor','default');
    });
    
    return true;
}

function saveCustomVideoID(event) {
    textfield = event.data.textfield;
    cells = selected_row.children('td');
    
 
    needle  = $(cells.get(2)).text()+' '+$(cells.get(3)).text();
    videoID = $(textfield).val();
    if(videoID==custom_video_default_textval)
        return;
    
    new_event = new Object();
    new_event.data = new Object();
    new_event.data.needle   = needle;
    new_event.data.videoId  = videoID;
    new_event.data.customVideoID = true;
    
    setAlternative(new_event);
    //event.data.cmenu.hide();
    
}

function enterVideoID(menu, value) {            
	
    $('.custom_video_menu').each(function(){
	
        input = document.createElement('input');
        $(input).attr('type','text');
        $(input).val(value);
        $(input).attr('size','25');        
        $(input).addClass('customVideoID');
	resetEnterVideoTextField(input);
        
        submit = document.createElement('input');
        $(submit).attr('type','button');
        $(submit).attr('value','Speichern');
        $(submit).click({'textfield':input,'cmenu':menu}, saveCustomVideoID);
        
        $(this).children('.context-menu-item-inner').html('');        
        $(this).children('.context-menu-item-inner').append(input);
        $(this).children('.context-menu-item-inner').append(submit);
        
    });
    
}

function resetEnterVideoTextField(input) {
	
        $(input).unbind('focus.clearer');
        $(input).bind('focus.clearer',function(){
		val=$(this).val();		
		if(val==custom_video_default_textval) {
			$(this).val('');			
		}
			
        });
        
        $(input).unbind('focusout.clearer');
        $(input).bind('focusout.clearer',function(){            
		val=$(this).val();
		if(val=='') {
			$(this).val(custom_video_default_textval); 
		}
			
		
        });
}

function setAlternative(event) {    
    needle=event.data.needle;
    video_id=event.data.videoId;
    
    //needle=decodeURIComponent(needle);
    needle=encodeURIComponent(needle);

    //console.log(event.data.videoId);

    if(!('customVideoID' in event.data)) {
        unmarkContextAlternative();
        markContextAlternative($(this));
    }
	
    
    load_url='./php/edit_env_vars.php?action=add&key='+needle+'&value='+video_id;
    
    //console.log(load_url);
	
    $.ajax(load_url,{
	   dataType: 'text'       
	})
    .done(function(load_data){   
        
        markAlternatives(needle);        
        loadSong(selected_row);  
    });
    
    return false;
}

function markContextAlternative(menu_item) {
    menu_item.css('font-style','italic');
    newtext = '* '+menu_item.text();
    menu_item.text(newtext);
}
function markAlternatives(needle) {
    needle=unescape(needle);
    rows = $(".track_row");
    
    for(cnt=0;cnt<rows.length;cnt++) {
        cur_row = rows.get(cnt);
        cells = $(cur_row).children('td');
        if(cells.length<4)
            continue;
        cur_needle = $(cells.get(2)).text()+' '+$(cells.get(3)).text();       
        
        if(needle==cur_needle)
        {
            num = $(cells.get(1)).text();
            if(num.indexOf('*')==-1)
                num=num+'*';
            $(cells.get(1)).text(num);
            for(cnt2=0;cnt2<cells.length;cnt2++)    
                $(cells.get(cnt2)).css('fontStyle','italic'); 
        }
            
    }
}

function unmarkContextAlternative() {
    $(".context-menu-item-inner").each(function(){
    old_text = $(this).text();
    if(old_text.indexOf('*')!=-1) {
        old_text = old_text.replace('*','');
        $(this).text(old_text);
        $(this).css('font-style','normal');
    } 
    });    
    
    $('.custom_video_menu input[type=text]').each(function(){
		$(this).val(custom_video_default_textval); 	
		resetEnterVideoTextField(this);
    });
}

function unmarkAlternatives(needle) {
    needle=unescape(needle);
    rows = $(".track_row");//selected_row.parent().children('TR');
    

    for(cnt=0;cnt<rows.length;cnt++) {
        cur_row = rows.get(cnt);
        cells = $(cur_row).children('td');
        if(cells.length<4)
            continue;
        cur_needle = $(cells.get(2)).text()+' '+$(cells.get(3)).text();
        if(needle==cur_needle) {
            num = $(cells.get(1)).text();
            if(num.indexOf('*')!=-1) {
                num=num.replace('*','');                
                $(cells.get(1)).text(num);
            }
            
            for(cnt2=0;cnt2<cells.length;cnt2++)    
                $(cells.get(cnt2)).css('fontStyle','normal');  
        }    
    }    
}

function deleteAlternative() { 
    cells = selected_row.children('td');
    needle = $(cells.get(2)).text()+' '+$(cells.get(3)).text(); 
    //needle=decodeURIComponent(needle);
    needle=encodeURIComponent(needle);
    //console.log(event.data.videoId);
    
    edit_url='./php/edit_env_vars.php?action=del&key='+needle;
	
    $.ajax(edit_url,{
       dataType: 'text' 
    })
    .done(function(edit_data){                     
        if(edit_data=='0')
            return;          
        
        unmarkContextAlternative();
        unmarkAlternatives(needle);   
        loadSong(selected_row);   
		
    });   
}
