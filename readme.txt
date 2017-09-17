About:

The last.fm Youtube Radio searches the listened tracks of a given last.fm user on YouTube.
When a Video is found (via the YouTube search,
or in preference a custom video id or alternative search result selected through the context menu)
the Video is playing in the Youtube player.
You can create your own playlist via the context menu 'Add to playlist' or drag n drop.
additionally there is a Chart list which will be updated each time a song is heared.
You can use the hotkeys to control the player.


Installation:

1. Place this folder somewhere under your document Root e.g.: http://example.com/lfmtube
2. create a last.fm user with a Developer API key
3. create a youtube user with a Developer API Key
4. copy the file conf/example.settings to conf/settings.ini
5. enter the API keys in the settings.ini or under http://example.com/lfmtube/admin (password is lfmtube)
   and adjust other settings as needed
5. open http://example.com/lfmtube and enjoy

Directory Structure:
|
+- conf -> Configuration Files and sqlite Database
|   |
|   +- settings.ini -> here you have to adjust the Youtube/Last.fm settings for the player.
|   +- replace_strings.txt this file is checked when parsing the Song Title and Artist for searching the Song on YouTube.
|       you can define replacements for a specific part of a song here e.g. remove [unnknown] from all Song Titles.
|   +- lasttube.db - this is the sqlite Database
+- themes -> place new themes into this directory. simply copy an existing theme directory and rename it to your new theme name
+- locale -> here you can localize the Strings. currently supported langs: english and german
             to create a new language, copy an existing language file and rename it to the country specific code, 
	     e.g. locale_nl.properties for netherland. Translate all Strings and add it to the locale.info file in the format:	     
	     nl netherlands
+- images -> all used images
+- includes -> all includes files (youtube php api lastfm helper classes etc.)
+- js -> all required js files 
+- php -> all required php files
+- tmp -> temp folder for generated templates


Installation:

1. Place this folder somewhere under your document Root e.g.: http://example.com/lfmtube
2. create a last.fm user with a Developer API key
3. create a youtube user with a Developer API Key
4. copy the file conf/example.settings to conf/settings.ini
5. enter the API keys in the settings.ini or under http://example.com/lfmtube/admin (password is lfmtube)
   and adjust other settings as needed
5. open http://example.com/lfmtube and enjoy
