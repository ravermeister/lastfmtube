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
		<link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/pure-min.css" />
		<!--[if lte IE 8]>
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-old-ie-min.css" />
		<![endif]-->
		<!--[if gt IE 8]><!-->
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-min.css" />
		<!--<![endif]-->
		<!--// purecss.io //-->
		
		
		<link rel="stylesheet" href="{$BASE_PATH}/themes/default/css/jquery.contextmenu.css" type="text/css" />
		<link rel="stylesheet" href="{$BASE_PATH}/themes/default/css/styles.css" type="text/css" />		
		
		
		
                                <script type="text/javascript">
				
			var startvideo = '{$startvideo['videoId']}';
			var ytplayerwidth = '{$ytplayerwidth}';	
			var ytplayerheight = '{$ytplayerheight}';	
			var cmenutheme = '{$cmenutheme}';	
			var locale = '{$LOCALE}';
			var chartcounter ='{$charts_counter}';						
			var totalpages = '{$total_pages}';
			var active_page = '{$current_page}';
			
			
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

	

	<div class="footer">
		<span style="vertical-align:middle;text-align:center;">
		&copy;2017 <a href="https://www.rimkus.it" target="_blank">Jonny Rimkus</a>
		</span>
		&nbsp;&nbsp;
		<a href="//validator.w3.org/check?uri=referer" target="_blank">
			<img src="//www.w3.org/Icons/valid-xhtml10-blue" alt="Valid XHTML 1.0 Transitional" height="31" width="88" />
		</a>
	</div>
        </body>
</html>