package com.lenovo.priestsql.web.entity;

public class Column {

	/**
	 * 字段名字
	 */
	private String colName;
	/**
	 * 字段类型
	 */
	private String colType;
	/**
	 * 字段说明
	 */
	private String colComment;
	
	
	public Column() {
		
	}
	
	public Column(String colName, String colType, String colComment) {
		this.colName = colName;
		this.colType = colType;
		this.colComment = colComment;
	}



	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		this.colName = colName;
	}
	public String getColType() {
		return colType;
	}
	public void setColType(String colType) {
		this.colType = colType;
	}
	public String getColComment() {
		return colComment;
	}
	public void setColComment(String colComment) {
		this.colComment = colComment;
	}
	
}
