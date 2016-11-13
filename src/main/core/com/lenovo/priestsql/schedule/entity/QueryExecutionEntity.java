package com.lenovo.priestsql.schedule.entity;

import org.apache.commons.lang3.time.DateFormatUtils;

import java.util.Date;

/**
 * Query execute entity
 * @author luojiang2
 */
public class QueryExecutionEntity {
	//Id
	private int id;
	//Query id
	private int queryId;
	private QueryEntity queryEntity;
	//Query name
	private String name;
	private String aliasName;
	//Query owner
	private String owner;
	//Execute state
	private String executeState;
	//Execute start date
	private Date startDate;
	//Execute end date
	private Date endDate;
	//Execute duration
	private int duration;
	//Execute log
	private String log;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getQueryId() {
		return queryId;
	}
	public void setQueryId(int queryId) {
		this.queryId = queryId;
	}

	public QueryEntity getQueryEntity() {
		return queryEntity;
	}

	public void setQueryEntity(QueryEntity queryEntity) {
		this.queryEntity = queryEntity;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getExecuteState() {
		return executeState;
	}
	public void setExecuteState(String executeState) {
		this.executeState = executeState;
	}
	public Date getStartDate() {
		return startDate;
	}
	public String getStartDateString() {
		try {
			if (null != this.startDate) {
				return DateFormatUtils.ISO_DATETIME_FORMAT.format(this.startDate);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public String getEndDateString() {
		try {
			if (null != this.endDate) {
				return DateFormatUtils.ISO_DATETIME_FORMAT.format(this.endDate);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	public String getLog() {
		return log;
	}
	public void setLog(String log) {
		this.log = log;
	}
	public String getAliasName() {
		return aliasName;
	}
	public void setAliasName(String aliasName) {
		this.aliasName = aliasName;
	}


	public static enum ExecuteState {
		WAITING, RUNNING, STOPPED, CANCELLED, SUCCESS, FAILED;
	}
}