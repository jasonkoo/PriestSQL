package com.lenovo.priestsql.web.entity;

import java.util.Date;

import com.lenovo.priestsql.web.utils.ConnectionType;

public class QueryHistory {
	/**
	 * id
	 */
	private int id;
	/**
	 * 连接id
	 */
	private int connId;
	/**
	 * 查询时的用户名称
	 */
	private String loginName;
	/**
	 * 查询时选中的数据库
	 */
	private String dbName;
	/**
	 * 查询的sql
	 */
	private String sql;
	/**
	 * 查询结果缓存key
	 */
	private String queryKey;
	/**
	 * 查询结果页数缓存key
	 */
	private String queryCountKey;
	/**
	 * 是否是大数据查询
	 */
	private int forBigData;
	/**
	 * 提交查询的日期
	 */
	private Date date;
	/**
	 * 查询开始执行的时间,记为毫秒数
	 */
	private long startDate;
	/**
	 * 查询执行完成的时间
	 */
	private long finishDate;
	/**
	 * 运行状态,-1：错误；0:停止，1：正在运行；2：执行完成
	 */
	private RunningstateEnum runningState;
	/**
	 * H:hive;S:Spark;M:mysql;I:impala;P:postgresql
	 */
	private String queryType;
	/**
	 * 代理用户
	 */
	private String proxyUser;
	/**
	 * 本次查询是否创建临时表
	 */
	private int createTmpTable;
	/**
	 * 创建的临时表，被删除后清空
	 */
	private String tmpTable;
	/**
	 * 错误信息
	 */
	private String errorMessage;
	
	public QueryHistory() {

	}

	public QueryHistory(Param param) {
		this.sql = param.getOrginal_sql();
		this.forBigData = param.getForBigData();
		this.dbName = param.getDbName();
		this.proxyUser = param.getProxyUserName();
		this.connId=param.getConnId();
	}

	public int getConnId() {
		return connId;
	}

	public void setConnId(int connId) {
		this.connId = connId;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getQueryKey() {
		return queryKey;
	}

	public void setQueryKey(String queryKey) {
		// 将全量查询记录和普通查询记录合并
		this.queryKey = queryKey.replace("_fb", "");
	}

	public String getQueryCountKey() {
		return queryCountKey;
	}

	public void setQueryCountKey(String queryCountKey) {
		this.queryCountKey = queryCountKey;
	}

	public int getForBigData() {
		return forBigData;
	}

	public void setForBigData(int forBigData) {
		this.forBigData = forBigData;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public long getStartDate() {
		return startDate;
	}

	public void setStartDate(long startDate) {
		this.startDate = startDate;
	}

	public long getFinishDate() {
		return finishDate;
	}

	public void setFinishDate(long finishDate) {
		this.finishDate = finishDate;
	}

	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public int getRunningState() {
		if(runningState!=null){
			return runningState.getValue();
		}else{
			return 0;
		}
		
	}

	public void setRunningState(int runningState) {
		this.runningState = RunningstateEnum.getEnumByValue(runningState) ;
	}

	public void setRunningState(RunningstateEnum runningState) {
		this.runningState = runningState ;
	}
	
	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getQueryType() {
		return queryType;
	}

	public void setQueryType(String queryType) {
		this.queryType=queryType;
	}
	
	public void setQueryTypeEnum(ConnectionType connectionType) {
		if(connectionType==ConnectionType.HIVE){
			this.queryType = "H";
		}else if(connectionType==ConnectionType.SPARK){
			this.queryType = "S";
		}else if(connectionType==ConnectionType.MYSQL){
			this.queryType = "M";
		}else if(connectionType==ConnectionType.IMPALA){
			this.queryType = "I";
		}else if(connectionType==ConnectionType.POSTGRESQL){
			this.queryType="P";
		}else{
			this.queryType="Unkown";
		}
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getProxyUser() {
		return proxyUser;
	}

	public void setProxyUser(String proxyUser) {
		this.proxyUser = proxyUser;
	}

	public int getCreateTmpTable() {
		return createTmpTable;
	}

	public void setCreateTmpTable(int createTmpTable) {
		this.createTmpTable = createTmpTable;
	}

	public String getTmpTable() {
		return tmpTable;
	}

	public void setTmpTable(String tmpTable) {
		this.tmpTable = tmpTable;
	}
	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public enum RunningstateEnum {
		ERROR(-1), STOP(0), RUNNING(1), FINISHED(2);

		private int value;

		private RunningstateEnum(int value) {
			this.value = value;
		}

		public int getValue() {
			return value;
		}

		public static RunningstateEnum getEnumByValue(int value){
			switch (value) {
			case -1:
				return ERROR;
			case 0:
				return STOP;
			case 1:
				return RUNNING;
			case 2:
				return FINISHED;
			default:
				return null;
			}
		}
	}

	
}
