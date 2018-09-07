<div class="pure-menu pure-menu-horizontal">
    <ul class="pure-menu-list">
        <li class="pure-menu-item"><a href="#" class="pure-menu-link pure-button"
                                      onclick="javascript:toggleAboutContent('requirements');">Requirements</a></li>
        <li class="pure-menu-item"><a href="#" onclick="javascript:toggleAboutContent('about');" class="pure-menu-link">About</a>
        </li>

    </ul>
</div>
<div id="about" style="display:none;">
    <h2>About:</h2>
    <p>
        The last.fm Youtube Radio searches the listened tracks of a given last.fm user on YouTube.<br/>
        When a Video is found (via the YouTube search,<br/>
        or in preference a custom video id or alternative search result selected through the context menu)<br/>
        the Video is playing in the Youtube player.<br/>
        You can create your own playlist via the context menu 'Add to playlist' or drag n drop.<br/>
        additionally there is a Chart list which will be updated each time a song is heared.<br/>
        You can use the hotkeys to control the player.
    </p>
</div>

<div id="requirements">
    <h2>Requirements:</h2>
    <table class="requirements">
        <tr>
            <td>PHP >= 5.6</td>
            <td style="width:20px;">&nbsp;</td>
            <td id="req_php_version">
                <img src="{$SETTINGS['general']['baseurl']}/images/icon-cross-128.png" width="32" height="32"
                     alt="error Icon"/>
            </td>
        </tr>
        <tr>
            <td>PHP PDO SQLite or Mysql (any PDO DB should work, but untested)</td>
            <td style="width:20px;">&nbsp;</td>
            <td id="req_db_pdo">
                <img src="{$SETTINGS['general']['baseurl']}/images/icon-cross-128.png" width="32" height="32"
                     alt="error Icon"/>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank">
                    YouTube (Google) developer Account</a>, <br/>
                you need the API Key for doing automated search queries on youtube,<br/>and embed the player to your
                site
            </td>
            <td style="width:20px;">&nbsp;</td>
            <td id="req_yt_api">
                <img src="{$SETTINGS['general']['baseurl']}/images/icon-cross-128.png" width="32" height="32"
                     alt="error Icon"/>
            </td>
        </tr>
        <tr>
            <td>
                last.fm API <a href="https://www.last.fm/api/account/create" target="_blank">User</a>
                with <a href="https://www.last.fm/api" target="_blank">API Key</a>
            </td>
            <td style="width:20px;">&nbsp;</td>
            <td id="req_lfm_api">
                <img src="{$SETTINGS['general']['baseurl']}/images/icon-cross-128.png" width="32" height="32"
                     alt="error Icon"/>
            </td>
        </tr>
        <tr>
            <td>Database Connection</td>
            <td style="width:20px;">&nbsp;</td>
            <td id="req_db_con">
                <img src="{$SETTINGS['general']['baseurl']}/images/icon-cross-128.png" width="32" height="32"
                     alt="error Icon"/>
            </td>
        </tr>
        <tr>
            <td colspan="3" id="req_msg" style="padding:10px">&nbsp;</td>
        </tr>
        <tr>
            <td colspan="3">
                <input type="button" value="Check" class="pure-button" onclick="javascript:checkRequirements();"/>
            </td>
        </tr>
    </table>
</div>
