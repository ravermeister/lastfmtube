<?php
/* Smarty version 3.1.30, created on 2017-08-17 01:49:20
  from "/home/ravermeister/lfmtube/themes/default/index.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.30',
  'unifunc' => 'content_5994da008a6ba8_20386311',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '4e9d3cba1a8ebf85d0c75eddbd5eccb24d3b5818' => 
    array (
      0 => '/home/ravermeister/lfmtube/themes/default/index.tpl',
      1 => 1502927060,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:./playlist.tpl' => 1,
  ),
),false)) {
function content_5994da008a6ba8_20386311 (Smarty_Internal_Template $_smarty_tpl) {
?>
<!--//
encoding: UTF-8
//-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--// created by Jonny Rimkus <jonny@rimkus.it> //-->
<html
    xmlns="http://www.w3.org/1999/xhtml"   
>
	<head>
		<title><?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.title'];?>
</title>
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
		
		
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/themes/default/css/jquery.contextmenu.css" type="text/css" />
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/themes/default/css/styles.css" type="text/css" />		
		
		
		
                                <?php echo '<script'; ?>
 type="text/javascript">
				
			var startvideo = '<?php echo $_smarty_tpl->tpl_vars['startvideo']->value['videoId'];?>
';
			var ytplayerwidth = '<?php echo $_smarty_tpl->tpl_vars['ytplayerwidth']->value;?>
';	
			var ytplayerheight = '<?php echo $_smarty_tpl->tpl_vars['ytplayerheight']->value;?>
';	
			var cmenutheme = '<?php echo $_smarty_tpl->tpl_vars['cmenutheme']->value;?>
';	
			var locale = '<?php echo $_smarty_tpl->tpl_vars['LOCALE']->value;?>
';
			var chartcounter ='<?php echo $_smarty_tpl->tpl_vars['charts_counter']->value;?>
';						
			var totalpages = '<?php echo $_smarty_tpl->tpl_vars['total_pages']->value;?>
';
			var active_page = '<?php echo $_smarty_tpl->tpl_vars['current_page']->value;?>
';
			
			
			start_track = new Object();
			start_track.artist      = '<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['startvideo']->value['artist'], ENT_QUOTES, 'UTF-8', true);?>
';
			start_track.title       = '<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['startvideo']->value['title'], ENT_QUOTES, 'UTF-8', true);?>
';
			start_track.videoId     = '<?php echo $_smarty_tpl->tpl_vars['startvideo']->value['videoId'];?>
';
			
			
		<?php echo '</script'; ?>
>				
		<?php echo '<script'; ?>
 type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"><?php echo '</script'; ?>
>       										
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/jquery/jquery.cookie.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/jquery/jquery.contextmenu.js"><?php echo '</script'; ?>
>   		
		<?php echo '<script'; ?>
 type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/hazzik-jquery.livequery/1.3.6/jquery.livequery.min.js"><?php echo '</script'; ?>
>   
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/messageResource.min.js"><?php echo '</script'; ?>
>

		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/pagefunctions.js"><?php echo '</script'; ?>
> 
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/player.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/playercontrol.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/default_contextmenu.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/user_contextmenu.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/charts_contextmenu.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/hotkeys.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/charts.js"><?php echo '</script'; ?>
>     
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/user_playlist.js"><?php echo '</script'; ?>
>                                                                
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/topusers.js"><?php echo '</script'; ?>
> 	
	</head>
	<body>

    	
                            <h2 align="center"><a href="//www.last.fm/user/<?php echo $_smarty_tpl->tpl_vars['lastfm_user']->value;?>
" id="lastfm_user_title_url" target="_blank">
				<span id="lastfm_user_title"><?php echo $_smarty_tpl->tpl_vars['lastfm_user']->value;?>
</span></a>'s <?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.header.lastfmuser.suffix'];?>

			   </h2>                                                        
                                
                                
				
				<div  style="text-align:center;align:center;">
				    <div id="player"></div>  
				</div>	
		
                                <?php echo '<script'; ?>
 type="text/javascript">  	
			
			
			// initialize messageResource.js with settings
			messageResource.init({
			  // path to directory containing message resource files(.properties files),
			  // give empty string or discard this configuration if files are in the
			  // same directory as that of html file.
			  filePath : '<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/locale/'
			});
			// will load the file moduleName_fr_FR.properties.
			messageResource.load('locale', null, locale);		
			
			$(document).ready(function(){        				
				pageInit();
			}); 
                                <?php echo '</script'; ?>
>  
		
                                <br />
                                <div>                                    
                                    <span id="hotkeys_title">+ <?php echo $_smarty_tpl->tpl_vars['LANG']->value['hotkeys.title'];?>
</span>
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
                                    <a href="//www.last.fm/" target="_blank"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.playercontrol.lasftm.label'];?>
</a> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.playercontrol.user.label'];?>

                                    <input type="text" value="<?php echo $_smarty_tpl->tpl_vars['lastfm_user']->value;?>
" id="lastfm_user" /> 
                                    <input type="button" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.playercontrol.user.button'];?>
" onclick="loadLastFMUser();"/>                                    
                                </div>
                                
			<div class="pages">
			<input type="button" id="loadprev"  value="&lt;&lt;" />
			<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.pagecontrol.page'];?>

			<input type="text" id="pagefield" value="<?php echo $_smarty_tpl->tpl_vars['current_page']->value;?>
" size="1" maxlength="5" /> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.pagecontrol.page.of'];?>
 <span id="lastfm_user_pages_total"><?php echo $_smarty_tpl->tpl_vars['total_pages']->value;?>
</span> 
			<input type="button" id="pageload" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.pagecontrol.load'];?>
"/>

			<input type="button" id="loadnext" value="&gt;&gt;" />
                                 </div>
                                </div>
				
                                <div class="playlist">         
		  <h2 id="playlist-title" title="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.tooltip.hideshow'];?>
">- <?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.title'];?>
</h2>
                                    <?php $_smarty_tpl->_subTemplateRender("file:./playlist.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>
                                          
                                </div>
                    
			<div class="listcontainer">
        		<div class="charts">
				<h2 id="charts_title" title="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.tooltip.hideshow'];?>
">- <?php echo $_smarty_tpl->tpl_vars['LANG']->value['charts.title'];?>
</h2>
				<div id="charts_list" class="cmenu_charts">
				in this box, the Top Songs will appear
				</div>
			</div>
                   
        		<div class="topusers">
				<h2 id="topuser_title" title="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.tooltip.hideshow'];?>
">- <?php echo $_smarty_tpl->tpl_vars['LANG']->value['topuser.title'];?>
</h2>
				<div id="topuser_list" class="cmenu_topuser">
				in this box, the Top Last.fm user will be shown
				</div>                                      
			</div>
                        

        		<div class="userlist">				
				<h2 id="user_title" title="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['site.tooltip.hideshow'];?>
">- <?php echo $_smarty_tpl->tpl_vars['LANG']->value['userplaylist.title'];?>
</h2>
				<div id="user_list" class="cmenu_user">
				in this box, the custom playlist will appear
				</div>   
			</div>
			</div>
			<div style="clear:both;">&nbsp;</div>

			    
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
</html><?php }
}
