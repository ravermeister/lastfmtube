<!--//
encoding: UTF-8
//-->
<!DOCTYPE html>
<!--// created by Jonny Rimkus <jonny@rimkus.it> //-->
<html lang="{$LOCALE}">
<head>
    <title>LANG['site.title']</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link rel="stylesheet" href="themes/editorial/assets/css/main.css" />
        <link rel="shortcut icon" type="image/x-icon" href="{$BASE_PATH}/favicon.ico">
        <script type="text/javascript">
            var locale = '{$LOCALE}';
            var baseUrl = '{$BASE_PATH}';
        </script>

        <!-- data-main attribute tells require.js to load
         scripts/main.js after require.js loads. -->
		<script data-main="js/main" src="js/require.js" type="text/javascript"></script>
	</head>
	<body class="is-preload">
    <!--// fork me on github logo // -->
    <a href="https://github.com/you">
        <img style="position: absolute; top: 0; right: 0; border: 0;"
             src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
             alt="Fork me on GitHub">
    </a>
		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<div id="main">
						<div class="inner">

							<!-- Header -->
								<header id="header">
                                    <span style="font-size: 28pt;">
									<a href="//www.last.fm/user/{$lastfm_user}"
                                       id="lastfm_user_title_url"
                                       target="_blank" class="logo"><strong><span id="lastfm_user_title">{$lastfm_user}</span>'s</strong> LANG['site.header.lastfmuser.suffix']</a>
                                    </span>
									<ul class="icons">
                                        <li style="position: relative; bottom: -20px;"><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
										<li style="position: relative; bottom: -20px;"><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
										<li style="position: relative; bottom: -20px;"><a href="#" class="icon fa-snapchat-ghost"><span class="label">Snapchat</span></a></li>
										<li style="position: relative; bottom: -20px;"><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
										<li style="position: relative; bottom: -20px;"><a href="#" class="icon fa-medium"><span class="label">Medium</span></a></li>
									</ul>
								</header>

							<!-- Section -->
								<section>
                                    <div class="playercontrol">
                                        <span class="lastfmuser">
                                            <a href="//www.last.fm/" target="_blank">LANG['site.playercontrol.lasftm.label']</a>
                                            LANG['site.playercontrol.user.label']
                                            <input type="text"
                                                   value="{$lastfm_user}"
                                                   id="lastfm_user"/>
                                            <input type="button"
                                                   value="LANG['site.playercontrol.user.button']"
                                                   onclick="loadLastFMUser();"/>
                                        </span>
                                        <span class="pages">
                                            <input type="button" id="loadprev" value="&lt;&lt;"/>
                                            LANG['site.pagecontrol.page']

                                            <input type="text" id="pagefield" value="{$current_page}" size="1" maxlength="5"/>
                                            LANG['site.pagecontrol.page.of']

                                            <span id="lastfm_user_pages_total">{$total_pages}</span>
                                            <input type="button" id="loadnext" value="&gt;&gt;"/>
                                            <input type="button" id="pageload" value="LANG['site.pagecontrol.load']"/>
                                        </span>

                                        <div id="hotkeys_view">
                                                    <span>
                                                        Strg+&larr; = previous Track | Strg+&rarr; = next Track
                                                        | Strg+Enter = play/pause + = Vol. up | - = Vol. down |
                                                        &larr; = rewind | &rarr; = fast forward
                                                    </span>
                                        </div>
                                    </div>
                                    <br/>
                                    <div id="player"">Youtube player</div>
								</section>
						</div>
					</div>

				<!-- Sidebar -->
					<div id="sidebar">
						<div class="inner">

                            <!-- Menu -->
								<nav id="menu">
									<span style="height: 100px; display: block;"></span>
									<ul>
										<li><a id="topuser_title" title="LANG['site.tooltip.hideshow']">Top User</a></li>
                                        <li><a id="charts_title" title="LANG['site.tooltip.hideshow']">Top Songs</a></li>
										<li><a id="playlist_title" title="LANG['site.tooltip.hideshow']">Playlist</a></li>
										<li><a id="user_title" title="LANG['site.tooltip.hideshow']">My Playlist</a></li>
									</ul>
								</nav>

							<!-- Footer -->
								<footer id="footer">

                                    <ul class="icons" style="height: 20px;">
                                        <li>
                                            <a href="//validator.w3.org/check?uri=referer"
                                               target="_blank"
                                               style="border: none;">
                                                <img src="//www.w3.org/html/logo/badge/html5-badge-h-css3-semantics.png"
                                                     width="110" height="43"
                                                     alt="HTML5 Powered with CSS3 / Styling, and Semantics"
                                                     title="HTML5 Powered with CSS3 / Styling, and Semantics" />
                                            </a>
                                        </li>
                                        <li style="position: relative; bottom: 10px;">
                                            <a href="http://www.wtfpl.net/"
                                               target="_blank"
                                               style="border: none;">
                                                <img src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
                                                     width="80" height="15"
                                                     alt="WTFPL"/>
                                            </a>
                                        </li>
                                    </ul>

                                    <p class="copyright">
                                        &copy;2017 <a href="//www.rimkus.it" target="_blank">Jonny Rimkus</a>
                                        &lt;<a href="mailto:jonny@rimkus.it">jonny@rimkus.it</a>&gt;
                                    </p>
								</footer>

						</div>
					</div>
			</div>
	</body>
</html>