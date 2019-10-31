/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class Icon {
    constructor(name) {

        this.name = name;
        this.big = this.name + ' fa-2x';
        this.bigger = this.name + ' fa-3x';

        this.animated = this.name + ' faa-flash animated';
        this.animatedBig = this.animated + ' fa-2x';
        this.animatedBigger = this.animated + ' fa-3x';

    }

    isIcon(elem, big = false) {
        return $(elem).hasClass(big ? this.big : this.name);
    }
}

class Icons {
	constructor(){
        const play = new Icon('fa-play');
        const pause = new Icon('fa-pause');
        const stop = new Icon('fa-stop');
        const youtube = new Icon('fa fa-youtube');
        const search = new Icon('fa fa-search');
        const plus = new Icon('fa-plus');
        const minus = new Icon('fa-minus');
        const diamond = new Icon('fa fa-diamond');
        const headphones = new Icon('fas fa-headphones');
        const check = new Icon('fas fa-check');
        const loader = new Icon('fa fa-spinner faa-spin animated');
        const star = new Icon('fas fa-star');
        const trophy = new Icon('fas fa-trophy');
        const user = new Icon('fas fa-user');
        const trash = new Icon('fas fa-trash-alt');
        const save = new Icon('fas fa-save');
        
        const list = [
            Icons.play,
            Icons.pause,
            Icons.stop,
            Icons.youtube,
            Icons.search,
            Icons.plus,
            Icons.minus,
            Icons.diamond,
            Icons.headphones,
            Icons.check,
            Icons.loader,
            Icons.star,
            Icons.trophy,
            Icons.user,
            Icons.trash,
            Icons.save
        ];
	}
	
	static getIcon (elem, big) {
        for (let cnt = 0; cnt < Icons.list.length; cnt++) {
            if (Icons.list[cnt].isIcon(elem, big)) {
                return Icons.list[cnt];
            }
        }
        return null;
    }
	
	static getPlaylistIcon(playlist = null) {
        if (playlist === null) return Icons.diamond.big;
        switch (playlist) {
            case 'topsongs':
                return Icons.star;
            case 'topuser':
            case 'user-container':
                return Icons.trophy;
            case 'userlist':
                return Icons.user;
            case 'youtube':
                return Icons.youtube;
            case 'search':
            	if($page.SEARCH_RETURN_PLAYLIST !== null) {
            		return this.getPlaylistIcon($page.SEARCH_RETURN_PLAYLIST);
            	}
                return Icons.search;
            default:
                return Icons.headphones;
        }

    }
}