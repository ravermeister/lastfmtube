#!/bin/bash
# Jonny Rimkus <jonny@rimkus.it>
# 06.12.2019

doCheck(){
	if [ ! -f "./conf/settings.json" ]; then
		echo "settings.json is missing"
		exit 1
	fi
}

doStart() {
	docker-compose up -d
	docker exec -it lastfmtube /bin/sh -c 'sqlite3 /tmp/lfmdocker.db < /var/www/html/conf/init.db.sql'
	docker exec -it lastfmtube chown root:www-data /tmp/lfmdocker.db
	docker exec -it lastfmtube chmod g+w /tmp/lfmdocker.db
}

doStop(){
	docker-compose down
}

usage(){
	echo "$0 start|stop"
}

case "$1" in
	start)
		doCheck
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