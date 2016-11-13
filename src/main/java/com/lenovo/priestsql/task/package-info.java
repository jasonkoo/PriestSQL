/**
 * 
 */
/**
 * @author luojiang2
 *
 */
package com.lenovo.priestsql.task;

/**
 * Package scope interface.Only <code>AbstractTask</code> implements it.
 * Specific task class can only extends <code>AbstractTask</code>.
 * @author luojiang2
 */
interface Task extends Runnable,Comparable<AbstractTask>{
	
	/**
	 * Get task name
	 */
	String getName();
	
	/**
	 * Get task id
	 * @return
	 */
	String getId();
	
	/**
	 * Get task state
	 * @return
	 */
	com.lenovo.priestsql.task.TaskState getTaskState();
	
	/**
	 * Get task start time
	 * @return
	 */
	long getStartTime();
	
	/**
	 * Get task finish time
	 * @return
	 */
	long getFinishTime();
	
	/**
	 * Get task throws <code>Exception</code> or <code>Error</code> when task is running.
	 * @return
	 */
	Throwable getThrowable();
	
	/**
	 * Run task
	 */
	void run();
}