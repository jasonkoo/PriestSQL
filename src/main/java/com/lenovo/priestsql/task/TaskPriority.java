package com.lenovo.priestsql.task;

/**
 * Task priority
 */
public enum TaskPriority {
	/**
	 * High priority task.Firstly execute this kind of task.
	 */
	HIGH,
	/**
	 * Normal priority task.Execute this kind of task in order.
	 */
	NORMAL,
	/**
	 * Low priority task.Finally execute this kind of task.
	 */
	LOW;
}
