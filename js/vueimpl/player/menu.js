/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlayerMenu {
	
	static createVue(elementId){
		return new Vue({
            el: '#'+elementId+'>#player-menu',
            data: {
                PLAYSTATE: ''
            },
            methods: {
                togglePlay(play = false) {
                	$player.togglePlay(play);
                },

                prev: function () {
                    $player.loadPreviousSong();
                },
                next: function () {
                    $player.loadNextSong();
                },
                addToUserList: function () {
                    $playlist.addUserTrack($player.currentTrackData.track);
                    if ($page.PLAYLIST === 'userlist') {
                        $playlist.loader.loadCustomerList($page.myVues.playlist.menu.$data.CUR_PAGE);
                    }
                },
                searchVideo: function (event) {
                    if ($page.myVues.video.youtube.header.SEARCH_TRACK === null) return;

                    $page.myVues.video.youtube.header.$data.LOADING = true;
                    $playlist.loader.searchSong($page.myVues.video.youtube.header.SEARCH_TRACK, function () {
                        $page.myVues.video.youtube.header.$data.LOADING = false;
                    }, true);
                },
                showComments: function(event) {                	
                	$page.myVues.video.youtube.comments.toggleVisibility();
                	
                }
            }
        });
	}
}