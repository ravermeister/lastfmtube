//copyright 2013 by Jonny Rimkus a.k.a Ravermeister

var keys = new Object();
keys.arrows = new Object();

keys.arrows.left = 37;
keys.arrows.up = 38;
keys.arrows.right = 39;
keys.arrows.down = 40;
keys.enter = 13;
keys.add = 107;
keys.sub = 109;
keys.space = 32;
keys.enter = 13;


keys.ascii = new Object();
keys.ascii.add = 43;
keys.ascii.sub = 45;

$(document).keyup(function (event) {

    keycode = event.keyCode || event.which;
    if (event.ctrlKey) {
        switch (keycode) {
            case keys.arrows.left :
                loadPrevSong();
                break;

            case keys.arrows.right :
                loadNextSong();
                break;

            case keys.enter :
                togglePause();
                break;
        }
    }
});

$(document).keydown(function (event) {

    keycode = event.keyCode || event.which;
    if (!event.ctrlKey) {
        switch (keycode) {
            case keys.add :
                volumeUp(3);
                break;

            case keys.sub :
                volumeDown(3);
                break;

            case keys.arrows.left :
                rewind(3, true);
                break;

            case keys.arrows.right :
                fastForward(3, true);
                break;
        }
    }


});

