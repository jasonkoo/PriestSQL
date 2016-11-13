package com.lenovo.priestsql.task;

/**
 * PriestSql task type
 * @author luojiang2
 */
public enum TaskType {
	/**
	 * Execute hive sql
	 */
	EXECUTE_HIVE_SQL,
	/**
	 * Execute spark sql
	 */
	EXECUTE_SPARK_SQL,
	/**
	 * Download sql query result
	 */
	DOWNLOAD_SQL_QUERY_RESULT,
	/**
	 * Download hdfs file
	 */
	DOWNLOAD_HDFS_FILE;
}