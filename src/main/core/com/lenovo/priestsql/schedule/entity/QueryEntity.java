package com.lenovo.priestsql.schedule.entity;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.time.DateFormatUtils;

/**
 * Scheduler query entity
 * @author luojiang2
 */
public class QueryEntity {
	//Query Id
	private int id;
	//Unique Query name
	private String name;
	//Query sql
	private String sql;
	//variable and value separated by '=')
	private String variables;
	//Data source id
	private int datasourceId;
	// Database name
	private String databaseName;
	//Who create the query
	private String owner;
	//Crontab expression
	private String cronExpr;
	//Hive or spark proxy user
	private String proxyUser;
	//Execute period(Only displayed for the client)
	private String executePeriod;
	//PeriodConfig(Only displayed for the client)
	private String periodConfig;
	
	//Creating date of the query
	private Date createDate;
	//Next execution time of the query
	private Date execution;
	//E-mail is used to notify the query results
	private String email;
	//Whether the query is disable
	private boolean disable;
	//Query version
	private int version;
	//Latest version
	private boolean latestVersion;
	//Query description
	private String description;
	// Whether the query is deleted.
	private boolean isDelete;
	//Rely querys
	private List<QueryRelyEntity> relyQuerys;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSql() {
		return sql;
	}
	public void setSql(String sql) {
		this.sql = sql;
	}
	public int getDatasourceId() {
		return datasourceId;
	}
	public void setDatasourceId(int datasourceId) {
		this.datasourceId = datasourceId;
	}
	public String getVariables() {
		return variables;
	}
	public void setVariables(String variables) {
		this.variables = variables;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getCronExpr() {
		return cronExpr;
	}
	public void setCronExpr(String cronExpr) {
		this.cronExpr = cronExpr;
	}
	public String getProxyUser() {
		return proxyUser;
	}
	public void setProxyUser(String proxyUser) {
		this.proxyUser = proxyUser;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public String getCreateDateString() {
		try {
			if (null != this.createDate) {
				return DateFormatUtils.ISO_DATETIME_FORMAT.format(this.createDate);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Date getExecution() {
		return execution;
	}
	public void setExecution(Date execution) {
		this.execution = execution;
	}
	public String getExecutionString() {
		try {
			if (null != this.execution) {
				return DateFormatUtils.ISO_DATETIME_FORMAT.format(this.execution);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public boolean isDisable() {
		return disable;
	}
	public void setDisable(boolean disable) {
		this.disable = disable;
	}
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	public boolean isLatestVersion() {
		return latestVersion;
	}
	public void setLatestVersion(boolean latestVersion) {
		this.latestVersion = latestVersion;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<QueryRelyEntity> getRelyQuerys() {
		return relyQuerys;
	}
	public void setRelyQuerys(List<QueryRelyEntity> relyQuerys) {
		this.relyQuerys = relyQuerys;
	}
	public String getDatabaseName() {
		return databaseName;
	}
	public void setDatabaseName(String databaseName) {
		this.databaseName = databaseName;
	}
	public String getExecutePeriod() {
		return executePeriod;
	}
	public void setExecutePeriod(String executePeriod) {
		this.executePeriod = executePeriod;
	}
	public boolean isDelete() {
		return isDelete;
	}
	public void setDelete(boolean delete) {
		isDelete = delete;
	}
	public String getJobName() {
		return this.owner + "@@" + this.name;
	}
	public String getPeriodConfig() {
		return periodConfig;
	}
	public void setPeriodConfig(String periodConfig) {
		this.periodConfig = periodConfig;
	}
}