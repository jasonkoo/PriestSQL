package com.lenovo.priestsql.web.entity;

public class DataBase {

	/**
	 * 数据库id
	 */
	private int dbId;
	/**
	 * 数据库名字
	 */
	private String dbName;
	/**
	 * 数据库代理用户名
	 */
	private String dbOwner;
	/**
	 * 数据库包含的表的数量
	 */
	private int tblNum;
	
	
	public int getDbId() {
		return dbId;
	}
	public void setDbId(int dbId) {
		this.dbId = dbId;
	}
	public String getDbName() {
		return dbName;
	}
	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
	public String getDbOwner() {
		return dbOwner;
	}
	public void setDbOwner(String dbOwner) {
		this.dbOwner = dbOwner;
	}
	public int getTblNum() {
		return tblNum;
	}
	public void setTblNum(int tblNum) {
		this.tblNum = tblNum;
	}
}
