/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvueVideo {

    constructor() {
    	this.header = LibvuePlayerHeader.createVue();
        this.menu = LibvuePlayerMenu.createVue();        
        this.comments = LibvuePlayerComments.createVue();
    }


    update(json) {
        this.header.update(json);
        this.comments.update(json);
    }
}

