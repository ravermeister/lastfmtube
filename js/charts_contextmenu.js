//copyright 2013 by Jonny Rimkus a.k.a Ravermeister 

var charts_selected_row = false;
var charts_video_active = false;
var charts_video_default_textval = messageResource.get('charts.contextmenu.ytvideotext','locale',locale);  
if(typeof cmenutheme === 'undefined') {
	cmenutheme = 'default';
}

var cmenu_charts_base_options =
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
  
}  
 


var cmenu_charts_base_menu = 
[
    {'close Menu' : 
        {
            onclick: function(menuItemClicked,menuObject){return true},
            icon: './images/Xion_24.png'
        }
    },
    
    {'add to Playlist' :
        {
            onclick: function(menuItemClicked,menuObject){charts_addToPlaylist();return true;},
            icon: './images/Music_24.png'
        }
    }
];
