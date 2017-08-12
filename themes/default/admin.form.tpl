		<h1>Last.fm Youtube Radio</h1>
		
		<p>
			<h2>Requirements:</h2>
			<table>
				<tr>
					<td>PHP >= 5.6</td>
					<td width="20">&nbsp;</td>					
					<td id="req_php_version">
						<img src="../images/icon-cross-128.png" width="32" height="32"/>
					</td>
				</tr>
				<tr>
					<td>PHP PDO SQLite or Mysql</td>		
					<td width="20">&nbsp;</td>
					<td id="req_db_pdo">
						<img src="../images/icon-cross-128.png" width="32" height="32"/>
					</td>
				</tr>
				<tr>
					<td>
					<a href="https://developers.google.com/youtube/v3/getting-started" target="_blank">
					YouTube (Google) developer Account</a>, <br/>
					you need the API Key for doing automated search queries on youtube,<br/>and embed the player to your site
					</td>
					<td width="20">&nbsp;</td>
					<td id="req_yt_api">
						<img src="../images/icon-cross-128.png" width="32" height="32"/>
					</td>
				</tr>				
				<tr>
					<td>
					last.fm API  <a href="https://www.last.fm/api/account/create"target="_blank">User</a>  
					with <a href="https://www.last.fm/api" target="_blank">API Key</a>
					</td>
					<td width="20">&nbsp;</td>
					<td id="req_lfm_api">
						<img src="../images/icon-cross-128.png" width="32" height="32"/>
					</td>
				</tr>
				<tr>
					<td>Database Connection</td>		
					<td width="20">&nbsp;</td>
					<td id="req_db_con">
						<img src="../images/icon-cross-128.png" width="32" height="32"/>
					</td>
				</tr>
				<tr>
					<td colspan="3" id="req_msg" style="padding:10px">&nbsp;</td>
				</tr>
				<tr>
					<td colspan="3">
						<input type="button" value="Check" class="pure-button" onclick="javascript:checkRequirements();" />
					</td>
				</tr>
			</table>
		</p>
<hr noshade />
		<p>
			<h2>Configuration:</h2>

			<h3>conf/settings.ini</h3>
			<p>
				* alternatively you can adjust these values manually in the <font style="font-weight:bold;font-style:italic;">settings.ini</font> 
				file in the <font style="font-weight:bold;font-style:italic;">conf</font> directory
			</p>
			<form action="admin.php" method="post">			
			<table>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Base URL
						</font><br />
						the Base url from your Webserver url where lastfm Youtube Radio is saved. <br />
						e.g <font style="font-weight:bold;font-style:italic;">/</font> 
						if it is directly under the document root
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['baseurl']}" name="general_baseurl" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Language
						</font><br />
						the Display Language.
					</td>
					<td width="20">&nbsp;</td>
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
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Logging Path
						</font><br />
						Absolute Path to a logging file (for future use, debug output etc.)
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['logpath']}" name="general_logpath" value=""/> 
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Youtube Player Size
						</font><br />
						The Youtube Player Window Width/Height in Pixel or Percent of page
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						Width: <input type="text" value="{$SETTINGS['general']['playerwidth']}" name="general_playerwidth" size="4" value=""/> 
						&nbsp;&nbsp;
						Height: <input type="text" value="{$SETTINGS['general']['playerheight']}" name="general_playerheight" size="4" value=""/> 
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Theme
						</font><br />
						The Theme for the Last.fm YouTube Player
					</td>
					<td width="20">&nbsp;</td>
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
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Context Menu Theme
						</font><br />
						The Theme for the Context menu						
					</td>
					<td width="20">&nbsp;</td>
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
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Last.fm default User
						</font><br />
						The playlist of this Last.fm user will be loaded as default
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['general']['lastfm_defaultuser']}" name="general_lastfm_defaultuser" />
					</td>
				</tr>
				<tr><td colspan="3" height="60">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Database Connection url
						</font><br />
						The <a href="http://php.net/manual/de/pdo.construct.php" target="_blank">Database DSN</a> 
						Connection String
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['dsn']}" name="database_dsn" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Database Table prefix
						</font><br />
						this prefix is applied to all table names
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['table_prefix']}" name="database_table_prefix" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						DB Username
						</font><br />
						The Database user for this Connection
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['database']['username']}" name="database_username" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						DB User password
						</font><br />
						The Database user password for this Connection
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="password" name="database_password" />
					</td>
				</tr>
				<tr><td colspan="3" height="60">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Last.fm Username
						</font><br />
						The Last.fm User with the API Key for retrieving Song informations and doing search queries
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['lastfm']['user']}" name="lastfm_user" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Last.fm API Key
						</font><br />
						The Last.fm API Key for retrieving Song informations and doing search queries at last.fm
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['lastfm']['apikey']}" name="lastfm_apikey" />
					</td>
				</tr>
				<tr><td colspan="3" height="60">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Youtube API Key
						</font><br />
						The Youtube API Key for doing search queries at youtube
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" value="{$SETTINGS['youtube']['apikey']}" name="youtube_apikey" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Youtube User (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</font><br />
						The Youtube User
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" name="youtube_user" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Youtube email (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</font><br />
						The Youtube Email
					</td>
					<td width="20">&nbsp;</td>
					<td style="vertical-align: top;">
						<input type="text" name="youtube_email" />
					</td>
				</tr>
				<tr><td colspan="3" height="20">&nbsp;</td></tr>
				<tr>
					<td>
						<font style="font-weight:bold;font-style:italic;">
						Youtube Key file (for 
							<a href="https://developers.google.com/youtube/v3/guides/authentication" target="_blank">OAuth</a> 
						login)
						</font><br />
						The Youtube P12 Key File
					</td>
					<td width="20">&nbsp;</td>
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
			<textarea class="texteditor" name="replace_strings" style="width:90%;height:250px;">{$REPLACE_STRINGS_FILE}</textarea>
			
			<br />
			<input type="submit" name="submit" value="Save" class="pure-button" />			
			</form>
		</p>