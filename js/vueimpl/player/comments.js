/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlayerComments {
	
	static createVue(elementId) {
		return new Vue({
            el: '#'+elementId+'>#video-comments',
            data: {
            	showComments: false,
            	videoId: '',
            	pageinfo: {},
            	commentData: [],
            },
            computed: {
        		showLoadMore: function() {        			
        			return undefined !== this.$data.pageinfo.NEXT 
        			&& null !== this.$data.pageinfo.NEXT 
        			&& 'null' !== this.$data.pageinfo.NEXT;
        		}
            },
            methods: {
            	normalizeMessage: function(comments) {
            		for(let cnt=0;cnt<comments.length;cnt++) {
            			let comment = comments[cnt];
            			let text = $.parseHTML(comment.text);
            				$(text).filter('a')
            				.attr('target','_blank');
            			let container = $('<div></div>');
            			$(container).append(text);
            			comment.text = $(container).html();
            		}
            	},
                update: function (json) {
                    this.$applyData(json);
                    if(undefined !== json.comments) {                    	
                    	this.normalizeMessage(json.comments);
                    	this.$data.commentData = json.comments;
                    }
                    if(undefined !== json.pageinfo) {
                    	this.$data.pageinfo = json.pageinfo;
                    }
                },
                append: function(json) {
 
                    if(undefined !== json.comments) {                    	
                    	this.normalizeMessage(json.comments);
                    	this.$data.commentData = this.$data.commentData.concat(json.comments);                    	
                    }
                    if(undefined !== json.pageinfo) {
                    	this.$data.pageinfo = json.pageinfo;
                    }       
                },                    
                toggleVisibility: function() {                	
                	this.$data.showComments = !this.$data.showComments;
                	if(this.$data.showComments) {
                		$playlist.loader.loadVideoCommentList($player.currentTrackData.videoId);
                	}
                },
                loadMore: function() {
                	let pinfo = this.$data.pageinfo;
                	if(undefined === pinfo.NEXT || false === pinfo.NEXT) {
                		return;
                	} 
                	$playlist.loader.loadVideoCommentList($player.currentTrackData.videoId, pinfo.NEXT);
                }
            }
        });
	}
}