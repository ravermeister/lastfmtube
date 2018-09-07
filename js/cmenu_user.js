//copyright 2013 by Jonny Rimkus a.k.a Ravermeister 

if (typeof cmenutheme === 'undefined') {
    cmenutheme = 'default';
}

var cmenu_user_base_options =
    {
        // true|false to turn the menu shadow on or off
        shadow: false,

        // The shadow offset to use for both X and Y. If this is set, it overrides
        // The individual X and Y values
        shadowOffset: 0,

        // The number of pixels to offset the shadow to the right/downwards
        // (this can be negative)
        shadowOffsetX: 5,
        shadowOffsetY: 5,

        // The shadow will by default be the size of the menu. These values adjust
        // that size to make the shadow larger or smaller. The default value here
        // of -3 looks best.
        shadowWidthAdjust: -3,
        shadowHeightAdjust: -3,

        // How transparent the shadow is
        shadowOpacity: .2,

        // The class to apply to the created DIV object that will be the shadow
        shadowClass: 'context-menu-shadow',

        // The color of the shadow
        shadowColor: 'black',

        // The number of pixels to move the menu left/down from where the mouse clicked
        offsetX: 0,
        offsetY: 0,

        // The jQuery selector to use to choose which DOM element to attach the menu to
        appendTo: 'body',

        // The direction (up|down) the menu will display
        direction: 'down',

        // Keep the menu within the visible area of the screen. If the menu would go
        // off the left or the bottom, it will be pushed left and/or displayed
        // upwards rather than downwards.
        constrainToScreen: true,

        // The jQuery transitions to use for showing and hiding the menu
        showTransition: 'show',
        hideTransition: 'hide',

        // The speed to use for transitions - slow/normal/fast/#ms
        showSpeed: 'normal',
        hideSpeed: 'normal',

        // Function to run after the show/hide transitions have completed
        showCallback: null,
        hideCallback: null,

        // CSS class names to apply to the generated menu HTML.
        // See http://www.JavascriptToolbox.com/lib/contextmenu/#themes
        className: 'context-menu',
        itemClassName: 'context-menu-item',
        itemHoverClassName: 'context-menu-item-hover',
        disabledItemClassName: 'context-menu-item-disabled',
        disabledItemHoverClassName: 'context-menu-item-disabled-hover',
        separatorClassName: 'context-menu-separator',
        innerDivClassName: 'context-menu-item-inner',
        // The class name prefix to prepend to the theme name for css styling
        themePrefix: 'context-menu-theme-',

        // Theme name. Included themes are: 'default','xp','vista','osx','human','gloss'
        // Multiple themes may be applied with a comma-separated list.
        theme: cmenutheme,

        beforeShow: function () {
            resetVars();
            loadDynamicMenu($(this.menu));
        }
    }

var cmenu_user_base_menu =
    [
        {
            'close Menu':
                {
                    onclick: function (menuItemClicked, menuObject) {
                        return true
                    },
                    icon: './images/Xion_24.png'
                }
        },

        $.contextMenu.separator,

        {
            'reset Youtube Video ID':
                {
                    className: 'delete_alternative',
                    onclick: function (menuItemClicked, menuObject) {
                        deleteAlternative();
                        return false;
                    },
                    icon: './images/Recycle_24.png'
                }
        },

        {
            'enter Youtube Video ID':
                {
                    onclick: function (menuItemClicked, menuObject) {
                        if (custom_video_active)
                            return false;

                        custom_video_active = true;
                        enterVideoID(menuObject, custom_video_default_textval);
                        return false;
                    },

                    icon: './images/Paint_24.png',
                    className: 'custom_video_menu'
                }
        },

        $.contextMenu.separator,

        {
            'remove from Playlist':
                {
                    onclick: function (menuItemClicked, menuObject) {
                        userlist_removeFromPlaylist($(this));
                        return true;
                    },
                    icon: './images/Xion_24.png'
                }
        },

        {
            'clear Playlist':
                {
                    onclick: function (menuItemClicked, menuObject) {
                        userlist_clearPlaylist($(this));
                        return true;
                    },
                    icon: './images/Recycle_24.png'
                }
        },

        $.contextMenu.separator,

        {
            '&nbsp;':
                {
                    className: 'dynamic_menu_loader'
                }
        },
    ];
