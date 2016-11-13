#!/bin/bash
JAVA_HOME=/home/priestAdmin/jdk1.8.0_101
dir=`dirname "${BASE-DIR-$0}"`
bin=`cd "$bin";pwd`

start_priestsql(){

	#Check JAVA_HOME environment variable
	if [ -n "$JAVA_HOME" ];then
		JAVA_HOME=$JAVA_HOME
	fi

	if [ -z "$JAVA_HOME" ];then
		echo "ERROR:JAVA_HOME is not set"
		exit 1
	fi

	#Set jvm start arguments
	JAVA_OPS="-server -Xmx8192m -Xms8192m -Xss256k"
	JAVA_OPS="$JAVA_OPS -XX:+UseG1GC"
	JAVA_OPS="$JAVA_OPS -XX:MaxGCPauseMillis=200"
	JAVA_OPS="$JAVA_OPS -XX:+HeapDumpOnOutOfMemoryError"
	JAVA_OPS="$JAVA_OPS -XX:HeapDumpPath=$bin/../logs"
	JAVA_OPS="$JAVA_OPS -XX:ErrorFile=/$bin/../logs/jvm_error.log"

	#Set class path
	lib=$bin/../lib
	CLASSPATH=$bin/../conf
	for jar in $lib/*.jar
	do
		CLASSPATH=$CLASSPATH:$jar
	done

	#Set web resources path environment variable
	WEB_RESOURCES_PATH=$bin/../webapp
	export WEB_RESOURCES_PATH

	#Start server
	RUN_CMD="\"$JAVA_HOME/bin/java\""
	RUN_CMD="$RUN_CMD -classpath \"$CLASSPATH\""
	RUN_CMD="$RUN_CMD $JAVA_OPS"
	RUN_CMD="$RUN_CMD com.lenovo.priestsql.ContextServer $@"
	RUN_CMD="$RUN_CMD >> \"$bin/../logs/console.log\" 2>&1 &"
	echo $RUN_CMD
	eval $RUN_CMD

	echo $! > ../priestsql.pid
}


stop_priestsql(){
	pid=`cat ../priestsql.pid`
	num=`ps -e | grep $pid | wc -l`
	if (($num == 1));then
		kill -9 $pid
		echo "The process has been stoped"
	else
	  	echo "The process not started"
	  	exit 1
	fi
}

restart_priestsql(){
	stop_priestsql
	start_priestsql
}

case $1 in
 	 "start")
		start_priestsql
		;;
	"stop")
		stop_priestsql
		;;
	"restart")
		restart_priestsql
		;;
  	*)
    	echo "Usage: priestsql {start|stop|restart}"
   		exit 1
   		;;
esac