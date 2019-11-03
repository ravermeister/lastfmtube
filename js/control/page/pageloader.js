/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PageLoader {

	constructor(page) {
		
		this.page = page;
    	this.pageLoaded = function (success) {
    		$page.setMainPageLoading();
    		if(typeof callBack === 'function') {
    			callBack(success);
    		}
    	};
	}
	
	loadTopSongs(){
		

	}
}