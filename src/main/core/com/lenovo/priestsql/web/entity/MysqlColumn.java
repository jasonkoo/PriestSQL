package com.lenovo.priestsql.web.entity;

public class MysqlColumn extends Column{
	/**
	 * 字段能否为空
	 */
	private String colIsNull;
	/**
	 * 字段key类型
	 */
	private String colKey;
	/**
	 * 字段默认值
	 */
	private Object colDefault;
	/**
	 * 字段额外信息
	 */
	private String colExtra;
	
	public MysqlColumn() {
		super();
	}
	
	public MysqlColumn(String colName, String colType, String colComment) {
		super(colName, colType, colComment);
	}
	
	public MysqlColumn(String colIsNull, String colKey, Object colDefault,
			String colExtra) {
		this.colIsNull = colIsNull;
		this.colKey = colKey;
		this.colDefault = colDefault;
		this.colExtra = colExtra;
	}
	
	public String getColIsNull() {
		return colIsNull;
	}
	public void setColIsNull(String colIsNull) {
		this.colIsNull = colIsNull;
	}
	public String getColKey() {
		return colKey;
	}
	public void setColKey(String colKey) {
		this.colKey = colKey;
	}
	public Object getColDefault() {
		return colDefault;
	}
	public void setColDefault(Object colDefault) {
		this.colDefault = colDefault;
	}
	public String getColExtra() {
		return colExtra;
	}
	public void setColExtra(String colExtra) {
		this.colExtra = colExtra;
	}
	
	
	
}
