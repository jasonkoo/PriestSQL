package com.lenovo.priestsql.web.entity;

public class PostgresqlColumn extends Column{
	/**
	 * 字段能否为空
	 */
	private String colIsNull;
	/**
	 * 字段默认值
	 */
	private Object colDefault;
	
	
	public PostgresqlColumn() {
		super();
	}
	
	public PostgresqlColumn(String colName, String colType, String colComment) {
		super(colName, colType, colComment);
	}
	
	public PostgresqlColumn(String colIsNull, Object colDefault) {
		this.colIsNull = colIsNull;
		this.colDefault = colDefault;
	}
	
	public String getColIsNull() {
		return colIsNull;
	}
	public void setColIsNull(String colIsNull) {
		this.colIsNull = colIsNull;
	}
	public Object getColDefault() {
		return colDefault;
	}
	public void setColDefault(Object colDefault) {
		this.colDefault = colDefault;
	}
	
	
}
