<!--//
encoding: UTF-8
//-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--// created by Jonny Rimkus <jonny@rimkus.it> //-->
<html
    xmlns="http://www.w3.org/1999/xhtml"   
>
	<head>
		<title>{$LANG['site.title']}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<!--// purecss.io //-->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/pure-min.css" type="text/css" />
		<!--[if lte IE 8]>
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-old-ie-min.css" type="text/css" />
		<![endif]-->
		<!--[if gt IE 8]><!-->
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-min.css" type="text/css" />
		<!--<![endif]-->
		<!--// purecss.io //-->
		
		
		<link rel="stylesheet" href="{$BASE_PATH}/themes/dark/css/jquery.contextmenu.css" type="text/css" />
		<link rel="stylesheet" href="{$BASE_PATH}/themes/dark/css/styles.css" type="text/css" />		
		
		
		
                                <script type="text/javascript">
				
			var startvideo = '{$startvideo['videoId']}';
			var ytplayerwidth = '{$ytplayerwidth}';	
			var ytplayerheight = '{$ytplayerheight}';	
			var cmenutheme = '{$cmenutheme}';	
			var locale = '{$LOCALE}';
			var chartcounter ='{$charts_counter}';						
			var totalpages = '{$total_pages}';
			var active_page = '{$current_page}';
			var lastfm_user = '{$lastfm_user}';
			var lastfm_user_visit = '{$lastfm_user_visit}';
			
			start_track = new Object();
			start_track.artist      = '{$startvideo['artist']|escape:"html"}';
			start_track.title       = '{$startvideo['title']|escape:"html"}';
			start_track.videoId     = '{$startvideo['videoId']}';
			
			
		</script>				
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/jquery/jquery.cookie.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/jquery/jquery.contextmenu.js"></script>
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/hazzik-jquery.livequery/1.3.6/jquery.livequery.min.js"></script>   
		<script type="text/javascript" src="{$BASE_PATH}/js/messageResource.min.js"></script>

		<script type="text/javascript" src="{$BASE_PATH}/js/pagefunctions.js"></script> 
		<script type="text/javascript" src="{$BASE_PATH}/js/player.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/playercontrol.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/default_contextmenu.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/user_contextmenu.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/charts_contextmenu.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/hotkeys.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/charts.js"></script>     
		<script type="text/javascript" src="{$BASE_PATH}/js/user_playlist.js"></script>                                                                
		<script type="text/javascript" src="{$BASE_PATH}/js/topusers.js"></script> 	
	</head>
	<body>

    	
                            <h2 align="center"><a href="//www.last.fm/user/{$lastfm_user}" id="lastfm_user_title_url" target="_blank">
				<span id="lastfm_user_title">{$lastfm_user}</span></a>'s {$LANG['site.header.lastfmuser.suffix']}
			   </h2>                                                        
                                
                                
				{* youtube embed: html5 method *}
				<div  style="text-align:center;align:center;">
				    <div id="player"></div>  
				</div>	
		
                                <script type="text/javascript">  	
			
			
			// initialize messageResource.js with settings
			messageResource.init({
			  // path to directory containing message resource files(.properties files),
			  // give empty string or discard this configuration if files are in the
			  // same directory as that of html file.
			  filePath : '{$BASE_PATH}/locale/'
			});
			// will load the file moduleName_fr_FR.properties.
			messageResource.load('locale', null, locale);		
			
			$(document).ready(function(){        				
				pageInit();
			}); 
                                </script>  
		
                                <br />
                                <div>                                    
                                    <span id="hotkeys_title">+ {$LANG['hotkeys.title']}</span>
                                    <div id="hotkeys_view">    
                                        <span>
                                            Strg+&larr; = previous Track | Strg+&rarr; = next Track | Strg+Enter = play/pause<br />
                                            + = Vol. up | - = Vol. down | &larr; = rewind | &rarr; = fast forward
                                        </span>
                                    </div>
                                </div>     

                                <br />
			<div class="playercontrol">
                                <div class="lastfmuser">
                                    <a href="//www.last.fm/" target="_blank">{$LANG['site.playercontrol.lasftm.label']}</a> {$LANG['site.playercontrol.user.label']}
                                    <input type="text" value="{$lastfm_user}" id="lastfm_user" /> 
                                    <input type="button" value="{$LANG['site.playercontrol.user.button']}" onclick="loadLastFMUser();"/>                                    
                                </div>
                                
			<div class="pages">
			<input type="button" id="loadprev"  value="&lt;&lt;" />
			{$LANG['site.pagecontrol.page']}
			<input type="text" id="pagefield" value="{$current_page}" size="1" maxlength="5" /> {$LANG['site.pagecontrol.page.of']} <span id="lastfm_user_pages_total">{$total_pages}</span> 
			<input type="button" id="pageload" value="{$LANG['site.pagecontrol.load']}"/>

			<input type="button" id="loadnext" value="&gt;&gt;" />
                                 </div>
                                </div>
			
        	<div class="topusers">
				<h2 id="topuser_title" title="{$LANG['site.tooltip.hideshow']}">- {$LANG['topuser.title']}</h2>
				<div id="topuser_list" class="cmenu_topuser">
				in this box, the Top Last.fm user will be shown
				</div>                                      
			</div>
				
			<div class="playlist">         
		  <h2 id="playlist-title" title="{$LANG['site.tooltip.hideshow']}">- {$LANG['playlist.title']}</h2>
                                    {include file='./playlist.tpl'}                                          
            </div>
                    
			<div class="listcontainer">
        		<div class="charts">
				<h2 id="charts_title" title="{$LANG['site.tooltip.hideshow']}">- {$LANG['charts.title']}</h2>
				<div id="charts_list" class="cmenu_charts">
				in this box, the Top Songs will appear
				</div>
			</div>

       		<div class="userlist">				
				<h2 id="user_title" title="{$LANG['site.tooltip.hideshow']}">- {$LANG['userplaylist.title']}</h2>
				<div id="user_list" class="cmenu_user">
				in this box, the custom playlist will appear
				</div>   
			</div>
			</div>
			<div style="clear:both;">&nbsp;</div>

			    
	<div class="footer">
		<a href="//validator.w3.org/check?uri=referer" target="_blank"><img src="//www.w3.org/Icons/valid-xhtml10-blue" alt="Valid XHTML 1.0 Transitional" height="31" width="88" /></a>
		&nbsp;
		<a href="http://www.wtfpl.net/" target="_blank"><img src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png" width="80" height="15" alt="WTFPL"/></a>
		&nbsp;&nbsp;|&nbsp;&nbsp;
		<span style="vertical-align:middle;text-align:center;">
		&copy;2017 <a href="https://www.rimkus.it" target="_blank">Jonny Rimkus</a> &lt;<a href="mailto:jonny@rimkus.it">jonny@rimkus.it</a>&gt;
		</span>
	</div>
        </body>
</html>
