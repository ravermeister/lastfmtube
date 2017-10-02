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
		<th align="left" width="25px">&nbsp;</th>
		<th align="left" width="5%">{$LANG['playlist.header.nr']}</th>
		<th align="left">{$LANG['playlist.header.artist']}</th>
		<th align="left">{$LANG['playlist.header.title']}</th>
		<th align="left" width="100px">{$LANG['playlist.header.lastplay']}</th>
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
		<td  width="25px">
			{if $autostart==true&&($track_count-1)=={$startvideo['videoIndex']}}
			<img src="./images/equalizer.gif" alt="equalizer" width="20" height="15"/>
			{assign var="current_play" value="track_{$track_count}"}
			{else}
			&nbsp;
			{/if}
		</td>

		{if $track['video_id'] != -1}
		<td class="title_playing" width="5%">{$track_count}*</td>
		<td class="title_playing">{$track['artist']}</td>
		<td class="title_playing">{$track['title']}</td>
		<td class="title_playing" width="100px">{$track['dateofplay']}</td>
		{else}
		<td width="5%">{$track_count}</td>
		<td>{$track['artist']}</td>
		<td>{$track['title']}</td>
		<td width="100px">{$track['dateofplay']}</td>
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