/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvueVideo {

    constructor(elementId) {
    	
    	this.elementId = elementId;
    	
    	this.header = LibvuePlayerHeader.createVue(elementId);
        this.menu = LibvuePlayerMenu.createVue(elementId);        
        this.comments = LibvuePlayerComments.createVue(elementId);
    }


    update(json) {
        this.header.update(json);
        this.comments.update(json);
    }
}

