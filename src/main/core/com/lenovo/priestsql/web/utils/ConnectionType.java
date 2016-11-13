package com.lenovo.priestsql.web.utils;

public enum ConnectionType {
	
	MYSQL("mysql"),
	IMPALA("impala"),
	SPARK("spark"),
	HIVE("hive"),
	POSTGRESQL("postgresql");
	
	private String value;

	private ConnectionType(String name) {
		this.value=name;
	}
	
	public String getName(){
		return value;
	}
	
}
