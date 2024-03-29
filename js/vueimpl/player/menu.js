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
                },
                searchVideo: function (_) {
                    $page.loader.searchSong($player.currentTrackData.track);
                },
                showComments: function(_) {
                	$page.myVues.video.youtube.comments.toggleVisibility();                	
                }
            }
        });
	}
}
