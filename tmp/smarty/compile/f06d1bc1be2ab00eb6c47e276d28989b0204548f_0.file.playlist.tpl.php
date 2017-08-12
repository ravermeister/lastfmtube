<?php
/* Smarty version 3.1.30, created on 2017-08-06 12:18:06
  from "/home/ravermeister/lastfm.rimkus.it/html/playlist.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.30',
  'unifunc' => 'content_5986ecdeabb7b0_70484433',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'f06d1bc1be2ab00eb6c47e276d28989b0204548f' => 
    array (
      0 => '/home/ravermeister/lastfm.rimkus.it/html/playlist.tpl',
      1 => 1502014683,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5986ecdeabb7b0_70484433 (Smarty_Internal_Template $_smarty_tpl) {
if (!is_callable('smarty_function_counter')) require_once '/home/ravermeister/lastfm.rimkus.it/includes/smarty/libs/plugins/function.counter.php';
?>
<!--//
encoding: UTF-8
//-->
<div class="playlistcontainer">
<?php echo '<script'; ?>
 type="text/javascript">
<!--//
$(function() {
      $(".cmenu_default").contextMenu( cmenu_default_base_menu , cmenu_default_base_options );
});
initPlaylistDnD();
//-->
<?php echo '</script'; ?>
>

<table class="pure-table" id="playlistdata">
<thead>
	<tr>
		<th align="left">&nbsp;</th>
		<th align="left"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.header.nr'];?>
</th>
		<th align="left"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.header.artist'];?>
</th>
		<th align="left"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.header.title'];?>
</th>
		<th align="left"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.header.lastplay'];?>
</th>
	</tr>
</thead>
<tbody class="cmenu_default">
<?php smarty_function_counter(array('name'=>"track_counter",'start'=>$_smarty_tpl->tpl_vars['track_no']->value,'skip'=>1,'assign'=>"track_count"),$_smarty_tpl);?>

<?php $_smarty_tpl->_assignInScope('current_play', "none");
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['tracklist']->value, 'track');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['track']->value) {
?>	
	<tr          
	onclick="setPlaylist(PLAYLIST.DEFAULT);loadSong($(this));" 
	id="track_<?php echo $_smarty_tpl->tpl_vars['track_count']->value;?>
" 
	class="track_row"    
	title="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['playlist.contextmenu.tooltip'];?>
"
	onmouseover="activeRow(this);"
	onmouseout="inactiveRow(this);"
	>	
		<td>
			<?php ob_start();
echo $_smarty_tpl->tpl_vars['startvideo']->value['videoIndex'];
$_prefixVariable1=ob_get_clean();
if ($_smarty_tpl->tpl_vars['autostart']->value == true && ($_smarty_tpl->tpl_vars['track_count']->value-1) == $_prefixVariable1) {?>
			<img src="./images/equalizer.gif" alt="equalizer" width="20" height="15"/>
			<?php $_smarty_tpl->_assignInScope('current_play', "track_".((string)$_smarty_tpl->tpl_vars['track_count']->value));
?>
			<?php } else { ?>
			&nbsp;
			<?php }?>
		</td>

		<?php if ($_smarty_tpl->tpl_vars['track']->value['video_id'] != -1) {?>
		<td class="title_playing"><?php echo $_smarty_tpl->tpl_vars['track_count']->value;?>
*</td>
		<td class="title_playing"><?php echo $_smarty_tpl->tpl_vars['track']->value['artist'];?>
</td>
		<td class="title_playing"><?php echo $_smarty_tpl->tpl_vars['track']->value['title'];?>
</td>
		<td class="title_playing"><?php echo $_smarty_tpl->tpl_vars['track']->value['dateofplay'];?>
</td>
		<?php } else { ?>
		<td><?php echo $_smarty_tpl->tpl_vars['track_count']->value;?>
</td>
		<td><?php echo $_smarty_tpl->tpl_vars['track']->value['artist'];?>
</td>
		<td><?php echo $_smarty_tpl->tpl_vars['track']->value['title'];?>
</td>
		<td><?php echo $_smarty_tpl->tpl_vars['track']->value['dateofplay'];?>
</td>
		<?php }?>
	</tr>
<?php echo smarty_function_counter(array('name'=>'track_counter'),$_smarty_tpl);?>

<?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>

</tbody>
</table>
</div> <!--// playlistcontainer //-->

<?php if ($_smarty_tpl->tpl_vars['current_play']->value != 'none') {
echo '<script'; ?>
 type="text/javascript">
setCurrentPlay(document.getElementById('<?php echo $_smarty_tpl->tpl_vars['current_play']->value;?>
'));    
<?php echo '</script'; ?>
>
<?php }
}
}
