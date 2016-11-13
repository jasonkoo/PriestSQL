package com.lenovo.priestsql.task;

/**
 * Task state
 * @author luojiang2
 */
public enum TaskState {
	NEW,		//New task
	COMMITTED,	//Committed task
	RUNNING,	//Running task
	FINISHED,	//Finished task
	FAILED,		//Failed task
	KILLED;		//Killed task
}