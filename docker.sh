#!/bin/bash

doStart() {
	
	docker-compose up -d
	docker exec -it lastfmtube sqlite3 /tmp/lfmprod.db < ./conf/init.db.sql  
	docker exec -it lastfmtube ls -l /tmp
	docker exec -it lastfmtube chown root:www-data /tmp/lfmprod.db
	docker exec -it lastfmtube chmod g+w /tmp/lfmprod.db
}

doStop(){
	docker stop lastfmtube
}

usage(){
	echo "$0 start|stop"
}

case "$1" in
	start)
		doStart
	;;
	
	stop)
		doStop
	;;
	
	*)
		usage
		exit 1
	;; 
esac
exit 0