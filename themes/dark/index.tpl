<!--//
encoding: UTF-8
//-->
<!DOCTYPE html>
<!--// created by Jonny Rimkus <jonny@rimkus.it> //-->
<html lang="{$LANG['lang.code']}">
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
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/he/1.1.1/he.min.js"></script>		
		<script type="text/javascript" src="{$BASE_PATH}/js/jquery/jquery.cookie.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/jquery/jquery.contextmenu.js"></script>
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/hazzik-jquery.livequery/1.3.6/jquery.livequery.min.js"></script>   
		<script type="text/javascript" src="{$BASE_PATH}/js/messageResource.min.js"></script>
		
		<script type="text/javascript" src="{$BASE_PATH}/js/page_functions.js"></script> 
		<script type="text/javascript" src="{$BASE_PATH}/js/player.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/player_control.js"></script>		
		<script type="text/javascript" src="{$BASE_PATH}/js/cmenu_default.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/cmenu_user.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/cmenu_charts.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/cmenu_functions.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/hotkeys.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/playlist_title.js"></script>     
		<script type="text/javascript" src="{$BASE_PATH}/js/playlist_user.js"></script>
		<script type="text/javascript" src="{$BASE_PATH}/js/playlist_topuser.js"></script>
	</head>
	<body>

{literal}
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async="async" src="//www.googletagmanager.com/gtag/js?id=UA-26904270-14"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-26904270-14');
</script>
{/literal}

<!--// fork me on github logo // -->
<a href="https://github.com/ravermeister/lastfmtube" target="_blank">
<img style="position: absolute; top: 0; left: 0; border: 0;" src="//camo.githubusercontent.com/c6625ac1f3ee0a12250227cf83ce904423abf351/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677261795f3664366436642e706e67" alt="Fork me on GitHub" />
</a>


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


                        <div class="playlist-menu pure-menu pure-menu-horizontal">
                                <ul class="pure-menu-list">
                                <li class="pure-menu-item"><a class="pure-menu-link" id="topuser_title" title="{$LANG['site.tooltip.hideshow']}">+ {$LANG['topuser.title']}</a></li>
                                <li class="pure-menu-item"><a class="pure-menu-link" id="playlist-title" title="{$LANG['site.tooltip.hideshow']}">- {$LANG['playlist.title']}</a></li>
                                <li class="pure-menu-item"><a class="pure-menu-link" id="charts_title" title="{$LANG['site.tooltip.hideshow']}">+ {$LANG['charts.title']}</a></li>
                                <li class="pure-menu-item"><a class="pure-menu-link" id="user_title" title="{$LANG['site.tooltip.hideshow']}">+ {$LANG['userplaylist.title']}</a></li>
                                </ul>
                        </div>

			<div class="playlist-container">
				<div class="playlist-main">
					<div id="topuser_list" class="topusers cmenu_topuser">
						in this box, the Top Last.fm user will be shown
					</div>

					<div class="playlist">
						{include file='./playlist.tpl'}
					</div>

					<div id="charts_list" class="charts cmenu_charts">
						in this box, the Top Songs will appear
					</div>
				</div>

                                <div class="playlist-sidebar">
                                        <div id="user_list" class="userlist cmenu_user">
                                                in this box, the custom playlist will appear
                                        </div>
                                </div>
				<div style="clear:both;">&nbsp;</div>
                        </div>

			    
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
