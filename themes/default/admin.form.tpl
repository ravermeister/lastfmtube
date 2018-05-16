<h1>Last.fm Youtube Radio</h1>
{include file='admin.about.tpl'}

<hr style="border-style: solid;" />
		<div>
			<h2>Configuration:</h2>

			<h3>conf/settings.ini</h3>
			<p>
				* alternatively you can adjust these values manually in the <span style="font-weight:bold;font-style:italic;">settings.ini</span> 
				file in the <span style="font-weight:bold;font-style:italic;">conf</span> directory
			</p>
			<form action="admin.php" method="post">			
			<table>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Base URL
						</span><br />
						the Base url from your Webserver url where lastfm Youtube Radio is saved. <br />
						e.g <span style="font-weight:bold;font-style:italic;">/</span> 
						if it is directly under the document root
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['baseurl']}" name="general_baseurl" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Language
						</span><br />
						the Display Language.
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<select name="general_lang" size="1">
							{foreach from=$SUPPORTED_LOCALES item=LANG}	
								{if $LANG['value'] == $SETTINGS['general']['lang']}
									<option value="{$LANG['value']}" selected="selected">{$LANG['desc']}</option>
								{else}
									<option value="{$LANG['value']}">{$LANG['desc']}</option>
								{/if}
								
							{/foreach}
						</select>
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Logging Path
						</span><br />
						Absolute Path to a logging file (for future use, debug output etc.)
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['logpath']}" name="general_logpath" /> 
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Youtube Player Size
						</span><br />
						The Youtube Player Window Width/Height in Pixel or Percent of page
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						Width: <input type="text" value="{$SETTINGS['general']['playerwidth']}" name="general_playerwidth" size="4" /> 
						&nbsp;&nbsp;
						Height: <input type="text" value="{$SETTINGS['general']['playerheight']}" name="general_playerheight" size="4" /> 
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Theme
						</span><br />
						The Theme for the Last.fm YouTube Player
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<select name="general_theme" size="1">
							{foreach from=$SUPPORTED_THEMES item=THEME}	
								{if $THEME == $SETTINGS['general']['theme']}
									<option selected="selected">{$THEME}</option>
								{else}
									<option>{$THEME}</option>
								{/if}
								
							{/foreach}
						</select>
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Context Menu Theme
						</span><br />
						The Theme for the Context menu						
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<select name="general_cmenutheme" size="1">
							{foreach from=$SUPPORTED_CMENUTHEMES item=CMENUTHEME}	
								{if $CMENUTHEME == $SETTINGS['general']['cmenutheme']}
									<option selected="selected">{$CMENUTHEME}</option>
								{else}
									<option>{$CMENUTHEME}</option>
								{/if}
								
							{/foreach}
						</select>
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Last.fm default User
						</span><br />
						The playlist of this Last.fm user will be loaded as default
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['lastfm_defaultuser']}" name="general_lastfm_defaultuser" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:60px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Database Connection url
						</span><br />
						The <a href="http://php.net/manual/de/pdo.construct.php" target="_blank">Database DSN</a> 
						Connection String
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['dsn']}" name="database_dsn" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Database Table prefix
						</span><br />
						this prefix is applied to all table names
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['table_prefix']}" name="database_table_prefix" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						DB Username
						</span><br />
						The Database user for this Connection
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['username']}" name="database_username" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						DB User password
						</span><br />
						The Database user password for this Connection
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="password" name="database_password" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:60px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Last.fm Username
						</span><br />
						The Last.fm User with the API Key for retrieving Song informations and doing search queries
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['lastfm']['user']}" name="lastfm_user" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Last.fm API Key
						</span><br />
						The Last.fm API Key for retrieving Song informations and doing search queries at last.fm
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['lastfm']['apikey']}" name="lastfm_apikey" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:60px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Youtube API Key
						</span><br />
						The Youtube API Key for doing search queries at youtube
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['youtube']['apikey']}" name="youtube_apikey" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Youtube User (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</span><br />
						The Youtube User
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" name="youtube_user" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Youtube email (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</span><br />
						The Youtube Email
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" name="youtube_email" />
					</td>
				</tr>
				<tr><td colspan="3" style="height:20px">&nbsp;</td></tr>
				<tr>
					<td>
						<span style="font-weight:bold;font-style:italic;">
						Youtube Key file (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</span><br />
						The Youtube P12 Key File
					</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" name="youtube_keyfile" />
					</td>
				</tr>
			</table>
			
			<br />
			<br />
			<h3>conf/replace_strings.txt</h3>
			<p>
				the song titles are processed with this file, if the title name contains a given key, 
				the part in the title is replaced by the value. <br/>
				Note, leave blank if you simply want to remove the key from the Song title
			</p>
			<textarea class="texteditor" name="replace_strings" rows="20" cols="100" >{$REPLACE_STRINGS_FILE}</textarea>
			
			<br />
			<input type="submit" name="submit" value="Save" class="pure-button" />			
			</form>
		</div>
