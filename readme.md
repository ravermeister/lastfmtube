Author | Jonny Rimkus jonny@rimkus.it
------ | https://www.rimkus.it
License | http://www.wtfpl.net/
------- |


About:

The last.fm Youtube Radio searches the listened tracks of a given last.fm user on YouTube.
When a Video is found (via the YouTube search,
or in preference a custom video id or alternative search result selected through the context menu)
the Video is playing in the Youtube player.
You can create your own playlist via the context menu 'Add to playlist' or drag n drop.
additionally there is a Chart list which will be updated each time a song is heared.
You can use the hotkeys to control the player.


Demo: http://lastfm.rimkus.it


requirements:

PHP >= 5.6
PHP PDO SQLite or Mysql (any PDO DB should work, but untested)


Installation:

1. Place this folder somewhere under your document Root e.g.: http://example.com/lfmtube
2. copy the file conf/example.settings to conf/settings.ini
3. create a last.fm user with a Developer API key
4. create a youtube user with a Developer API Key
5. enter the API keys in the settings.ini or under http://example.com/lfmtube/admin 
   (default password is lfmtube) and adjust other settings as needed
6. open http://example.com/lfmtube and enjoy

Update: I have removed the googe php api from this repo and linked against the git repository.
to use it you have to download the google api release zip and extract it to includes/googleapi
cd /path/to/lfmtube
wget https://github.com/google/google-api-php-client/releases/download/v2.2.1/google-api-php-client-2.2.1.zip
unzip google-api-php-client-2.2.1.zip
mv google-api-php-client-2.2.1 includes/googleapi



Directory Structure:
```
|
+- conf -> Configuration Files and sqlite Database
|   |
|   +- settings.ini -> here you have to adjust the Youtube/Last.fm settings for the player.
|   +- replace_strings.txt -> this file is checked when parsing the Song Title and Artist 
|   |                         for searching the Song on YouTube. You can define replacements 
|   |                         for a specific part of a song here 
|   |                         e.g. remove [unnknown] from all Song Titles.
|   +- lasttube.db -> this is the sqlite Database (will be created automatically)
+- themes -> place new themes into this directory. 
|            simply copy an existing theme directory and rename it to your new theme name
+- locale -> here you can localize the Strings. currently supported langs: english and german
|            to create a new language, copy an existing language file and 
|            rename it to the country specific code, e.g. locale_nl.properties for netherland. 
|            Translate all Strings and add it to the locale.info file in the format: nl netherlands
+- images -> all used images
+- includes -> all includes files (youtube php api lastfm helper classes etc.)
+- js -> all required js files 
+- php -> all required php files
+- tmp -> temp folder for generated templates
```
