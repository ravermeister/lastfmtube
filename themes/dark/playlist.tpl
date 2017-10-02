<!--//
encoding: UTF-8
//-->
<div class="playlistcontainer">
<script type="text/javascript">
<!--//
$(function() {
      $(".cmenu_default").contextMenu( cmenu_default_base_menu , cmenu_default_base_options );
});
initPlaylistDnD();
//-->
</script>

<table class="pure-table" id="playlistdata">
<thead>
	<tr>
		<th align="left" style="width: 15px !important;">&nbsp;</th>
		<th align="left">{$LANG['playlist.header.nr']}</th>
		<th align="left">{$LANG['playlist.header.artist']}</th>
		<th align="left">{$LANG['playlist.header.title']}</th>
		<th align="left">{$LANG['playlist.header.lastplay']}</th>
	</tr>
</thead>
<tbody class="cmenu_default">
{counter name="track_counter" start=$track_no skip=1 assign="track_count"}
{assign var="current_play" value="none"}
{foreach from=$tracklist item=track}	
	<tr          
	onclick="setPlaylist(PLAYLIST.DEFAULT);loadSong($(this));" 
	id="track_{$track_count}" 
	class="track_row"    
	title="{$LANG['playlist.contextmenu.tooltip']}"
	onmouseover="activeRow(this);"
	onmouseout="inactiveRow(this);"
	>	
		<td>
			{if $autostart==true&&($track_count-1)=={$startvideo['videoIndex']}}
			<img src="./images/equalizer.gif" alt="equalizer" width="20" height="15"/>
			{assign var="current_play" value="track_{$track_count}"}
			{else}
			&nbsp;
			{/if}
		</td>

		{if $track['video_id'] != -1}
		<td class="title_playing">{$track_count}*</td>
		<td class="title_playing">{$track['artist']}</td>
		<td class="title_playing">{$track['title']}</td>
		<td class="title_playing">{$track['dateofplay']}</td>
		{else}
		<td>{$track_count}</td>
		<td>{$track['artist']}</td>
		<td>{$track['title']}</td>
		<td>{$track['dateofplay']}</td>
		{/if}
	</tr>
{counter name=track_counter}
{/foreach}
</tbody>
</table>
</div> <!--// playlistcontainer //-->

{if $current_play!='none'}
<script type="text/javascript">
setCurrentPlay(document.getElementById('{$current_play}'));    
</script>
{/if}