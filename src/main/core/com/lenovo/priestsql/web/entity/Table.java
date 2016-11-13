package com.lenovo.priestsql.web.entity;

import java.util.List;

public class Table {

	/**
	 * 表id
	 */
	private int tblId;
	/**
	 * 表名
	 */
	private String tblName;
	/**
	 * 库名
	 */
	private String dbName;
	/**
	 * 分区字段
	 */
	private List<String> partitions;
	
	public int getTblId() {
		return tblId;
	}
	public void setTblId(int tblId) {
		this.tblId = tblId;
	}
	public String getTblName() {
		return tblName;
	}
	public void setTblName(String tblName) {
		this.tblName = tblName;
	}
	public List<String> getPartitions() {
		return partitions;
	}
	public void setPartitions(List<String> partitions) {
		this.partitions = partitions;
	}
	public String getDbName() {
		return dbName;
	}
	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
}
