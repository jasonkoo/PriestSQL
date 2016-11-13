package com.lenovo.priestsql.hql;

/**
 * Operation type
 * @author luojiang2
 */
public enum OperationType {
	//QUERY
	QUERY,
	//DDL
	CREATE_TABLE_AS_QUERY,CREATE,DROP,ALTER,TRUNCATE,SHOW,DESCRIBE,ANALYZE,
	//DML
	LOAD,UPDATE,DELETE,IMPORT,EXPORT,EXPLAIN,
	//UNKNOWN
	UNKNOWN;
}