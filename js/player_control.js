//copyright 2013 by Jonny Rimkus a.k.a Ravermeister

var loading_error = false;
var initialized = false;
var loadPage_active = false;
var loadPlaylistTimer = false;
var context_menu_active = false;
var METHOD = {
    'FLASH': 1,
    'HTML5': 2
};
var embed_method = METHOD.FLASH;

var default_imagecell = null;
var default_active_row = null;
var active_page = 1;
var all_pages = -1;


var charts_active_row = null;
var charts_imagecell = null;

var custom_active_row = null;
var custom_imagecell = null;

var image_equalizer = new Image();
image_equalizer.src = './images/equalizer.gif';
image_equalizer.width = 20;
image_equalizer.height = 15;


//var image_progress      = new Image();

var PLAYLIST = {
    'DEFAULT': '1',
    'CHARTS': '2',
    'CUSTOM': '3',
}

var current_playlist = PLAYLIST.DEFAULT;

function setPageCount(pagecnt) {
    all_pages = pagecnt;
}

function stripCRLF(rawString) {
    start = -1;
    end = -1;
    for (cnt = 0; cnt < rawString.length; cnt++) {
        if (
            '\r' != rawString.charAt(cnt) &&
            '\n' != rawString.charAt(cnt) &&
            '\t' != rawString.charAt(cnt)
        ) {
            break;
        }
        start = cnt;
    }

    for (cnt = (rawString.length - 1); cnt >= 0; cnt--) {
        if (
            '\r' != rawString.charAt(cnt) &&
            '\n' != rawString.charAt(cnt) &&
            '\t' != rawString.charAt(cnt)
        ) {
            break;
        }

        end = cnt;
    }

    if (start != -1) {
        if (end != -1)
            return rawString.substring(start, end);
        else
            return rawString.substring(start);
    }
    else if (end != -1)
        return rawString.substring(0, end);
    else
        return rawString;

}

function playlist_charts_loadMovie(elem) {
    cells = elem.children('td');
    needle = new Object();
    needle.artist = $(cells.get(1)).text();
    needle.title = $(cells.get(2)).text();

    if (player != null) {
        vars_request_url = './php/edit_env_vars.php?action=get&key=' + encodeURIComponent(needle.artist + ' ' + needle.title);


        $.ajax(vars_request_url, {
            dataType: 'text'
        })
            .done(function (vars_data) {
                vars_data = stripCRLF(vars_data);

                if (vars_data != '' && vars_data != 'undefined') {
                    needle.videoId = vars_data;
                    loadYoutubeVideo(needle);
                    active_page = $('#pagefield').val();
                }
                else {
                    search_request_url = './php/do_search.php?needle=' + encodeURIComponent(needle.artist + ' ' + needle.title);
                    $.ajax(search_request_url, {
                        dataType: 'json'
                    })
                        .done(function (search_data) {
                            if (search_data.length > 0 && search_data[0].video_id != '' && search_data[0].video_id != 'undefined') {
                                needle.videoId = search_data[0].video_id;
                                loadYoutubeVideo(needle);
                                active_page = $('#pagefield').val();
                            }
                            else
                                loadNextSong();
                        });
                }
            });
    }
}

function playlist_default_loadMovie(elem) {
    cells = $(elem).children('td');
    needle = new Object();
    needle.artist = $(cells.get(2)).text();
    needle.title = $(cells.get(3)).text();
    //console.log(needle);

    if (player != null) {
        vars_request_url = './php/edit_env_vars.php?action=get&key=' + encodeURIComponent(needle.artist + ' ' + needle.title);


        $.ajax(vars_request_url, {
            dataType: 'text'
        })
            .done(function (vars_data) {
                vars_data = stripCRLF(vars_data);

                if (vars_data != '' && vars_data != 'undefined') {
                    needle.videoId = vars_data;
                    loadYoutubeVideo(needle);
                    active_page = $('#pagefield').val();
                }
                else {
                    search_request_url = './php/do_search.php?needle=' + encodeURIComponent(needle.artist + ' ' + needle.title);
                    $.ajax(search_request_url, {
                        dataType: 'json'
                    })
                        .done(function (search_data) {
                            if (search_data.length > 0 && search_data[0].video_id != '' && search_data[0].video_id != 'undefined') {
                                needle.videoId = search_data[0].video_id;
                                loadYoutubeVideo(needle);

                                active_page = $('#pagefield').val();
                            }
                            else
                                loadNextSong();


                        });
                }
            });
    }
}

function loadMovie(elem) {
    if (current_playlist == PLAYLIST.DEFAULT)
        playlist_default_loadMovie(elem);
    else if (current_playlist == PLAYLIST.CHARTS)
        playlist_charts_loadMovie(elem);
    else if (current_playlist == PLAYLIST.CUSTOM)
        playlist_user_loadMovie(elem);
}

function loadYoutubeVideo(trackdata) {
    player.loadVideoById(trackdata.videoId);
    charts_setCurrentTrack(trackdata);
}

function loadLastFMUser(user = false) {
    if (user != false) lm_username = user;
    else lm_username = $("#lastfm_user").val();

    lm_username = $.trim(lm_username);
    trackid = -1;
    trackname = '';
    trackartist = '';

    if (default_imagecell != null) {
        //row = default_imagecell.parentNode;
        trackid = default_active_row.getAttribute('id');
    }

    playlist = $("#playlistdata");
    old_playlist = playlist.html();
    playlist.html(
        '<div align="center" class="cmenu" style="width:100%;height:500px;vertical-align:center;">' +
        '<img src="./images/progress.gif" width="300" height="300"/></div>'
    );


    $.ajax('./php/change_lastfmuser.php', {
        type: 'POST',
        dataType: 'json',
        data: {
            'lastfm_user': lm_username
        }
    }).done(function (response) {
        if ('ok' != response.response_code) {
            //console.log(response.response_code);
            playlist.html(old_playlist);
            return;
        }
        $("#lastfm_user_title").text(lm_username);
        $("#lastfm_user").val(lm_username);
        $("#lastfm_user_title_url").attr('href', 'http://www.last.fm/user/' + lm_username);
        $("#pagefield").val(response.current_page);
        $("#lastfm_user_pages_total").text(response.total_pages);

        active_page = response.current_page;
        all_pages = response.total_pages;

        playlist.parent().replaceWith(response.playlist);

        if (current_playlist != PLAYLIST.DEFAULT)
            return;

        if (trackid != -1) {
            rows = $("#playlistdata .track_row");
            for (i = 0; i < rows.length; i++) {
                curtrackid = rows[i].getAttribute('id');

                if (curtrackid == trackid) {
                    cells = default_active_row.getElementsByTagName('td');
                    trackartist = $(cells[2]).text();
                    trackname = $(cells[3]).text();
                    cur_cells = rows[i].getElementsByTagName('td');
                    cur_trackartist = $(cur_cells[2]).text();
                    cur_trackname = $(cur_cells[3]).text();
                    if (cur_trackartist == trackartist && cur_trackname == trackname) {
                        cells = rows[i].getElementsByTagName('td');
                        cells[0].appendChild(image_equalizer);
                        for (j = 0; j < cells.length; j++) $(cells[j]).css('fontWeight', 'bold');
                        default_imagecell = cells[0];
                        default_active_row = default_imagecell.parentNode;


                        trackid = default_active_row.getAttribute('id');
                        break;
                    }
                }

            }
        }
        //if(autoplay) loadNextSong();

    });
}

function loadPlaylist(page, elem_id, autoplay) {
    trackid = -1;

    if (default_imagecell != null) {
        //row = default_imagecell.parentNode;
        trackid = default_active_row.getAttribute('id');
    }

    playlist_url = './php/get_playlist.php?page=' + page;
    elem = document.getElementById(elem_id);
    elem = $(elem).parent();
    //console.log(elem);
    //div_elem = document.createElement('div');
    //div_elem.setAttribute('align','center');
    //div_elem.setAttribute('class','cmenu');

    $(elem).html('<div align="center" class="cmenu" style="width:100%;height:500px;vertical-align:center;"><img src="./images/progress.gif" width="300" height="300"/></div>');

    $.ajax(playlist_url, {
        type: 'POST',
        dataType: 'text'
    })
        .done(function (playlist_data) {
            //console.log(playlist_data);

            $(elem).replaceWith(playlist_data);
            active_page = Number(page);


            if (current_playlist != PLAYLIST.DEFAULT)
                return;

            if (trackid != -1) {
                rows = $("#playlistdata .track_row");
                for (i = 0; i < rows.length; i++) {
                    curtrackid = rows[i].getAttribute('id');

                    if (curtrackid == trackid) {
                        cells = rows[i].getElementsByTagName('td');
                        for (j = 0; j < cells.length; j++) $(cells[j]).css('fontWeight', 'bold');
                        cells[0].appendChild(image_equalizer);
                        default_imagecell = cells[0];
                        default_active_row = default_imagecell.parentNode;


                        trackid = default_active_row.getAttribute('id');
                        break;
                    }

                }
            }
            initToggle();
            initContextMenu();
            if (autoplay) loadNextSong();
            loadPlaylistTimer = false;
        });
}


function onYouTubePlayerReady(event) {
    if (initialized)
        return;

    if (event.target != null) {
        player = event.target;
        embed_method = METHOD.HTML5;
    }

    else {
        player = document.getElementById(event);
        player.addEventListener("onStateChange", "playerStateChange");
        player.addEventListener("onError", "playerStateError");
        embed_method = METHOD.FLASH;
    }
    initialized = true;
}


function playerStateError(event) {
    if (embed_method == METHOD.HTML5)
        state = event.data;
    else
        state = event;

    /**
     2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
     5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.<strong></strong>
     100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
     101 – The owner of the requested video does not allow it to be played in embedded players.
     150 – This error is the same as 101. It's just a 101 error in disguise!
     **/
    if (state != 5) {
        loading_error = true;
        loadNextSong();
    }
}

function playerStateChange(event) {
    if (embed_method == METHOD.HTML5)
        state = event.data;
    else
        state = event;

    /**
     -1 (unstarted)
     0 (ended)
     1 (playing)
     2 (paused)
     3 (buffering)
     5 (video cued).
     **/

    if (state == '0') //||(state=='-1'&&loading_error))
        loadNextSong();
    else {
        if (current_playlist == PLAYLIST.DEFAULT) {
            if (state == '1') {
                if (default_imagecell != null) {

                    while (default_imagecell.firstChild)
                        default_imagecell.removeChild(default_imagecell.firstChild);
                    default_imagecell.appendChild(image_equalizer);

                }

                charts_startTimer(player.getDuration());
            }

        } else if (current_playlist == PLAYLIST.CHARTS) {
            if (state == '1') {
                if (charts_imagecell != null) {
                    while (charts_imagecell.firstChild)
                        charts_imagecell.removeChild(charts_imagecell.firstChild);
                    charts_imagecell.appendChild(image_equalizer);
                }

                charts_startTimer(player.getDuration());
            }


        } else if (current_playlist == PLAYLIST.CUSTOM) {
            if (state == '1') {
                if (custom_imagecell != null) {
                    $(custom_imagecell).html();
                    $(custom_imagecell).html(image_equalizer)
                    /*
                            while(custom_imagecell.firstChild)
                                custom_imagecell.removeChildren(custom_imagecell.firstChild);
                            custom_imagecell.appendChild(image_equalizer);                          */
                }

                charts_startTimer(player.getDuration());
            }

        }

        loading_error = false;
    }


}

function loadSong(elem) {
    if (current_playlist == PLAYLIST.DEFAULT)
        playlist_default_loadSong(elem);
    else if (current_playlist == PLAYLIST.CHARTS)
        playlist_charts_loadSong(elem);
    else if (current_playlist == PLAYLIST.CUSTOM)
        playlist_user_loadSong(elem);
}

function playlist_charts_loadSong(elem) {
    if (charts_imagecell != null) {
        row = charts_imagecell.parentNode;
        cells = row.getElementsByTagName('td');
        index = Array.prototype.indexOf.call(row.parentNode.childNodes, row);
        cells[0].innerHTML = (index + 1);
        for (i = 0; i < cells.length; i++)
            cells[i].style.fontWeight = '';
    }


    cells = elem.children('td');
    charts_imagecell = cells.get(0);
    charts_imagecell.innerHTML = '<img src="./images/progress.gif" height="15px" style="display:inline;z-index:1000;position:relative;text-align:center;vertical-align:middle;" />&nbsp;';


    for (j = 0; j < cells.length; j++)
        $(cells.get(j)).css('fontWeight', 'bold');

    loadMovie(elem);
}

function playlist_default_loadSong(elem) {
    if (default_imagecell != null) {
        default_imagecell.innerHTML = '&nbsp';
        cells = default_active_row.getElementsByTagName('td');
        for (i = 0; i < cells.length; i++)
            cells[i].style.fontWeight = '';
    }

    cells = elem.children('td');
    default_imagecell = cells.get(0);
    default_active_row = default_imagecell.parentNode;
    default_imagecell.innerHTML = '<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';


    for (j = 0; j < cells.length; j++)
        $(cells.get(j)).css('fontWeight', 'bold');

    loadMovie(elem);
}

function playlist_user_loadMovie(elem) {
    cells = elem.children('td');
    needle = new Object();
    needle.artist = $(cells.get(1)).text();
    needle.title = $(cells.get(2)).text();

    if (player != null) {
        vars_request_url = './php/edit_env_vars.php?action=get&key=' + encodeURIComponent(needle.artist + ' ' + needle.title);


        $.ajax(vars_request_url, {
            dataType: 'text'
        })
            .done(function (vars_data) {
                vars_data = stripCRLF(vars_data);

                if (vars_data != '' && vars_data != 'undefined') {
                    needle.videoId = vars_data;
                    loadYoutubeVideo(needle);
                    active_page = $('#pagefield').val();
                }
                else {
                    search_request_url = './php/do_search.php?needle=' + encodeURIComponent(needle.artist + ' ' + needle.title);
                    $.ajax(search_request_url, {
                        dataType: 'json'
                    })
                        .done(function (search_data) {
                            if (search_data.length > 0 && search_data[0].video_id != '' && search_data[0].video_id != 'undefined') {
                                needle.videoId = search_data[0].video_id;
                                loadYoutubeVideo(needle);
                                active_page = $('#pagefield').val();
                            }
                            else
                                loadNextSong();
                        });
                }
            });
    }
}

function playlist_user_loadNextSong() {
    rows = $(".user_entry");

    if (custom_imagecell != null) {
        custom_active_row = custom_imagecell.parentNode;
        custom_active_index = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == custom_active_row) {
                custom_active_index = i;
                break;
            }
        }

        if ((custom_active_index + 1) >= rows.length)
            custom_active_index = 0;
        else
            custom_active_index++;
    }
    else
        custom_active_index = 0;

    songelem = rows.get(custom_active_index);

    loadSong($(songelem));
}

function playlist_user_loadPrevSong() {
    rows = $(".user_entry");

    if (custom_imagecell != null) {
        custom_active_row = custom_imagecell.parentNode;
        custom_active_index = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == custom_active_row) {
                custom_active_index = i;
                break;
            }
        }
        if ((custom_active_index - 1) < 0)
            custom_active_index = 0;
        else
            custom_active_index--;
    }
    else
        custom_active_index = 0;

    songelem = rows.get(custom_active_index);
    loadSong($(songelem));
}

function playlist_user_loadSong(elem) {
    if (custom_imagecell != null) {
        row = custom_imagecell.parentNode;
        cells = row.getElementsByTagName('td');
        index = Array.prototype.indexOf.call(row.parentNode.childNodes, row);
        cells[0].innerHTML = (index + 1);
        for (i = 0; i < cells.length; i++)
            cells[i].style.fontWeight = '';
    }


    cells = elem.children('td');
    custom_imagecell = cells.get(0);
    custom_imagecell.innerHTML = '<img src="./images/progress.gif" height="15px" style="display:inline;z-index:1000;position:relative;" />&nbsp;';

    for (j = 0; j < cells.length; j++)
        $(cells.get(j)).css('fontWeight', 'bold');

    loadMovie(elem);
}

function setPlaylist(newplaylist) {

    if (current_playlist == newplaylist)
        return;

    if (current_playlist == PLAYLIST.DEFAULT) {
        if (default_imagecell != null) {
            default_imagecell.innerHTML = '&nbsp;';
            //row = imagecell.parentNode;
            $(default_active_row).find('td').css('font-weight', '');

            default_imagecell = null;
            default_active_row = null;
        }

    }
    else if (current_playlist == PLAYLIST.CHARTS) {
        if (charts_imagecell != null) {
            rows = $(".charts_entry");

            charts_active_row = charts_imagecell.parentNode;
            charts_activeindex = -1;
            for (i = 0; i < rows.length; i++) {
                if (rows[i] == charts_active_row) {
                    charts_activeindex = i;
                    break;
                }
            }

            charts_imagecell.innerHTML = (charts_activeindex + 1);
            $(charts_active_row).find('td').css('font-weight', '');

            charts_imagecell = null;
            charts_active_row = null;
        }
    }

    else if (current_playlist == PLAYLIST.CUSTOM) {
        if (custom_imagecell != null) {
            rows = $(".user_entry");

            custom_active_row = custom_imagecell.parentNode;
            custom_active_index = -1;
            for (i = 0; i < rows.length; i++) {
                if (rows[i] == custom_active_row) {
                    custom_active_index = i;
                    break;
                }
            }
            custom_imagecell.innerHTML = (custom_active_index + 1);
            $(custom_active_row).find('td').css('font-weight', '');

            custom_imagecell = null;
            custom_active_row = null;
        }
    }


    current_playlist = newplaylist;
}

function setCurrentPlay(elem) {
    if (elem.nodeName.toUpperCase() == 'tr'.toUpperCase()) {
        cells = elem.getElementsByTagName('td');
        default_imagecell = cells[0];
        for (j = 0; j < cells.length; j++) cells[j].style.fontWeight = 'bold';
        default_active_row = default_imagecell.parentNode;
    }
}

function loadNextPage(autoplay) {

    val = $("#pagefield").val();
    if (Number(val) < all_pages) val++;
    else val = 1;
    $("#pagefield").val(val);

    if (loadPlaylistTimer != false) return;
    loadPlaylistTimer = window.setTimeout(loadPlaylist(val, 'playlistdata', autoplay), 250);
}

function loadPrevPage(autoplay) {

    val = $("#pagefield").val();
    if (Number(val) > all_pages) val = 1;
    else if (val <= 1) val = all_pages;
    else val--;
    $("#pagefield").val(val);

    if (loadPlaylistTimer != false) return;
    loadPlaylistTimer = window.setTimeout(loadPlaylist(val, 'playlistdata', autoplay), 250);
}

function loadPrevSong() {
    if (current_playlist == PLAYLIST.DEFAULT)
        playlist_default_loadPrevSong();
    else if (current_playlist == PLAYLIST.CHARTS)
        playlist_charts_loadPrevSong();
    else if (current_playlist == PLAYLIST.CUSTOM)
        playlist_user_loadPrevSong();
}

function playlist_charts_loadPrevSong() {
    rows = $(".charts_entry");
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 

    if (charts_imagecell != null) {
        charts_active_row = charts_imagecell.parentNode;
        charts_activeindex = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == charts_active_row) {
                charts_activeindex = i;
                break;
            }
        }
        if ((charts_activeindex - 1) < 0)
            charts_activeindex = 0;
        else
            charts_activeindex--;
    }
    else
        charts_activeindex = 0;

    songelem = rows.get(charts_activeindex);

    loadSong($(songelem));
}

function playlist_default_loadPrevSong() {
    rows = $("div.track_row");
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 

    if (default_imagecell != null) {
        activerow = default_active_row;
        activeindex = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == activerow) {
                activeindex = i;
                break;
            }
        }

        /**
         TODO: implement
         loading previous page...
         */
        if ((activeindex - 1) < 0)
            activeindex = 0;
        else
            activeindex--;

        activecells = activerow.getElementsByTagName('div');
        for (i = 0; i < activecells.length; i++)
            activecells[i].style.fontWeight = '';
        default_imagecell.innerHTML = '&nbsp;';

    }
    else
        activeindex = 0;

    songelem = rows[activeindex];

    cells = songelem.getElementsByTagName('div');


    cells[0].innerHTML = '<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';

    for (j = 0; j < cells.length; j++)
        cells[j].style.fontWeight = 'bold';

    default_imagecell = cells[0];
    default_active_row = default_imagecell.parentNode;

    loadMovie(songelem);
}

function playlist_charts_loadNextSong() {
    rows = $(".charts_entry");

    if (charts_imagecell != null) {
        charts_active_row = charts_imagecell.parentNode;
        charts_activeindex = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == charts_active_row) {
                charts_activeindex = i;
                break;
            }
        }
        if ((charts_activeindex + 1) >= rows.length)
            charts_activeindex = 0;
        else
            charts_activeindex++;
    }
    else
        charts_activeindex = 0;

    songelem = rows.get(charts_activeindex);

    loadSong($(songelem));
}

function playlist_default_loadNextSong() {
    rows = $("#playlistdata .track_row");
    //elem        = document.getElementById('playlistdata');    
    //rows        = elem.getElementsByTagName('div'); 

    if (default_imagecell != null) {
        //console.log(default_active_row);
        activerow = default_active_row;
        activeindex = -1;
        for (i = 0; i < rows.length; i++) {
            if (rows[i] == activerow) {
                activeindex = i;
                break;
            }
        }
        //console.log('activeindex: '+activeindex+'  |  rows.length: '+rows.lenght);

        if ((activeindex + 1) >= rows.length) {
            //console.log('load next');
            loadNextPage(true);
            return;
        }
        else
            activeindex++;

        activecells = activerow.getElementsByTagName('td');
        for (i = 0; i < activecells.length; i++)
            activecells[i].style.fontWeight = '';
        default_imagecell.innerHTML = '&nbsp;';

    }
    else
        activeindex = 0;

    songelem = rows[activeindex];

    cells = songelem.getElementsByTagName('td');


    cells[0].innerHTML = '<img src="./images/progress.gif" height="25px" style="display:inline;z-index:1000;position:absolute;" />&nbsp;';

    for (j = 0; j < cells.length; j++)
        cells[j].style.fontWeight = 'bold';

    default_imagecell = cells[0];
    default_active_row = default_imagecell.parentNode;

    loadMovie(songelem);
}

function loadNextSong() {
    if (current_playlist == PLAYLIST.DEFAULT)
        playlist_default_loadNextSong();
    else if (current_playlist == PLAYLIST.CHARTS)
        playlist_charts_loadNextSong();
    else if (current_playlist == PLAYLIST.CUSTOM)
        playlist_user_loadNextSong();
}


function activeRow(elem) {
    active_row = elem;
}

function inactiveRow(elem) {
    active_row = null;
}


function loadPage(textfield_id, playlist_id, maxpages) {
    textfield = document.getElementById(textfield_id);
    value = Number(textfield.value);
    if (isNaN(textfield.value) || value == active_page || value > maxpages || value <= 0 || loadPage_active) {
        if (!loadPage_active) textfield.value = active_page;
        return;
    }

    if (loadPlaylistTimer != false) return;
    loadPlaylistTimer = window.setTimeout(loadPlaylist(value, playlist_id, false), 250);
}


function getCurrentVideoID() {
    video_url = player.getVideoUrl();
    video_arr = video_url.split('?')[1];
    video_arr = video_arr.split('&');
    for (cnt = 0; cnt < video_arr.length; cnt++) {
        keyval = video_arr[cnt].split('=');
        for (cnt2 = 0; cnt2 < keyval.length; cnt2++) {
            if (keyval[cnt2] == 'v' && keyval.length > (cnt2 + 1))
                return keyval[cnt2 + 1];
        }
    }


    return 'unknown';
}

function volumeUp(vol) {
    if (player != null) {
        oldvol = Math.floor(player.getVolume());
        newvol = oldvol + vol;
        if (newvol > 100)
            newvol = 100;
        if (player.isMuted()) {
            player.setVolume(vol);
            player.unMute();
            return;
        }


        player.setVolume(newvol);
    }
}

function volumeDown(vol) {
    if (player != null) {
        oldvol = Math.floor(player.getVolume());
        newvol = oldvol - vol;
        if (newvol < 0)
            newvol = 0;

        player.setVolume(newvol);
    }
}

function rewind(sec, ahead) {
    if (player != null) {
        curtime = player.getCurrentTime();
        newtime = curtime - sec;
        if (newtime < 0)
            newtime = 0;
        player.seekTo(newtime, ahead);
    }
}

function fastForward(sec, ahead) {
    if (player != null) {
        curtime = player.getCurrentTime();
        newtime = curtime + sec;
        player.seekTo(newtime, ahead);
    }
}

function togglePause() {
    if (player != null) {
        state = player.getPlayerState();
        if (state == YT.PlayerState.PAUSED)
            player.playVideo();
        else if (state == YT.PlayerState.PLAYING)
            player.pauseVideo();
    }
}
