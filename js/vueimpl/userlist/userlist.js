/*******************************************************************************
 * Created 2017, 2018 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvueUser {

    constructor(elementId) {
    	
    	this.elementId = elementId;
        const { createApp } = Vue
        this.header = {

            title: createApp({
                el: '#'+elementId+'>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    TYPE: '',
                    LOADING: false
                },
                
                computed: {
                    LOGO: function () {
                        let icon = $page.icons.getPageIcon(elementId);
                        return this.LOADING ? icon.animatedBig : icon.big;
                    }
                },
                
                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: createApp({
                el: '#'+elementId+'>.page-header-nav',
                data: {
                    TYPE: ''
                },
                computed: {
                    MENUS: function () {
                        return $page.menu.getMenu(this.TYPE);
                    }
                },

                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.TYPE = json.HEADER.TYPE;
                        }
                    }
                }
            })
        };


        this.content = createApp({
            el: '#'+elementId+'>.page-content',
            data: {
                USER_NR: 'Nr',
                USER_NAME: 'Name',
                USER_PLAYCOUNT: 'Played',
                USER_LASTPLAY: 'Last Played',

                USER: [{
                    NR: '',
                    NAME: '',
                    LASTPLAY: '',
                    PLAYCOUNT: '',
                    PLAY_CONTROL: '',
                    PLAYCOUNT_CHANGE: ''
                }],
                
                currentSort:'USER_PLAYCOUNT',
                currentSortDir:'desc'
            },
            
            computed: {
                SORTED_USER: function() {	
                    return this.USER.sort((a,b) => {
                      let modifier = 1;
                      if(this.currentSortDir === 'desc') modifier = -1;                                                                 
                      switch(this.currentSort) {
                    	  case 'USER_NR':
                    		  let aNr = parseInt(a.NR);
                    		  let bNr = parseInt(b.NR);
                    		  if(aNr < bNr) return -1 * modifier;
                    		  if(aNr > bNr) return 1 * modifier;  
                    		  break;
                    	  case 'USER_NAME':
                    		  if(a.NAME < b.NAME) return -1 * modifier;
                    		  if(a.NAME > b.NAME) return 1 * modifier;                    		  
                    		  break;
                    	  case 'USER_PLAYCOUNT':
                    		  let aCnt = parseInt(a.PLAYCOUNT);
                    		  let bCnt = parseInt(b.PLAYCOUNT);
                    		  if(aCnt < bCnt) return -1 * modifier;
                    		  if(aCnt > bCnt) return 1 * modifier;                    		  
                    		  break;
                    	  case 'USER_LASTPLAY':
                    		  if(a.LASTPLAY < b.LASTPLAY) return -1 * modifier;
                    		  if(a.LASTPLAY > b.LASTPLAY) return 1 * modifier;                    		  
                    		  break;                    		  
                      }
                      return 0;
                    });
                }
            },

            methods: {
                update: function (json) {
                    if (typeof json.LIST_HEADER !== 'undefined') {
                        this.$applyData(json.LIST_HEADER);
                        this.setSortChar();
                    }
                    if ('undefined' !== typeof json.content
                        	&& 'undefined' !== typeof json.content.LIST_HEADER) {
                            this.$applyData(json.content.LIST_HEADER);
                            this.setSortChar();
                    }    
                    if (typeof json.USER !== 'undefined') {
                        this.$applyData(json);
                    }
                },

                loadUser: function (user) {
                    if (user.PLAY_CONTROL !== 'play') return;

                    user.PLAY_CONTROL = 'loading';
                    $page.myVues.userlist.topuser.header.title.$data.LOADING = true;
                    $page.loader.loadPage($page.loader.pages.playlist.lastfm, {
                    	pnum: 1, 
                    	lfmuser: user.NAME
                    });
                },
                
                setSortChar: function() {
				    let sortChar = this.currentSortDir==='asc'?' ▲':' ▼';
				    this.USER_NR = this.USER_NR.replace(' ▲', '').replace(' ▼', '');
				    this.USER_NAME = this.USER_NAME.replace(' ▲', '').replace(' ▼', '');
				    this.USER_PLAYCOUNT = this.USER_PLAYCOUNT.replace(' ▲', '').replace( '▼', '');
				    this.USER_LASTPLAY = this.USER_LASTPLAY.replace(' ▲', '').replace(' ▼', '');

                      switch(this.currentSort) {
                    	  case 'USER_NR':
                    		  this.USER_NR += sortChar;
                    		  break;
                    	  case 'USER_NAME':
                    		  this.USER_NAME += sortChar;                  		  
                    		  break;
                    	  case 'USER_PLAYCOUNT':
                    		  this.USER_PLAYCOUNT += sortChar;                		  
                    		  break;
                    	  case 'USER_LASTPLAY':
                    		  this.USER_LASTPLAY += sortChar;                  		  
                    		  break;                    		  
                      }
                },
                
				sort: function(sort) {
				    // if s == current sort, reverse
					if(sort === this.currentSort) {
						this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';						
					}
				    this.currentSort = sort;
				    this.setSortChar();
				}
            }
        });
    }


    update(json) {
        this.content.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }
}
