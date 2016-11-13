package com.lenovo.priestsql.web.entity;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;

public class Param {

	Logger logger = Logger.getLogger(Param.class);

	/**
	 * 登录名
	 */
	private String loginName;
	/**
	 * 自定义条目的id
	 */
	private int id;
	/**
	 * jobbrowser中任务的id
	 */
	private String appId;
	/**
	 * 连接id
	 */
	private int ConnId;
	/**
	 * 页面窗口id
	 */
	private int queryIndex;
	/**
	 * 连接对象
	 */
	private CustomConnection customConnection;
	/**
	 * 数据库id
	 */
	private int dbId;
	/**
	 * 数据库名字
	 */
	private String dbName;
	/**
	 * 应用名称
	 */
	private String appName;
	/**
	 * 数据表id
	 */
	private int tblId;
	/**
	 * 数据表名字
	 */
	private String tblName;
	/**
	 * 开始的记录数
	 */
	@SuppressWarnings("unused")
	private int startIndex;
	/**
	 * 页数
	 */
	private int page;
	/**
	 * 每页的条数
	 */
	private int pageSize;
	/**
	 * 要执行的sql
	 */
	private String sql;
	/**
	 * 原始的sql
	 */
	private String orginal_sql;
	/**
	 * 用户名
	 */
	private String proxyUserName;
	/**
	 * 查询数据的key
	 */
	private String queryKey;
	/**
	 * 查询数据条数的key
	 */
	private String queryCountKey;
	/**
	 * 查询数据日志的key
	 */
	private String logKey;
	/**
	 * 通用的查询参数
	 */
	private String paramString;
	/**
	 * 是否是大数据查询
	 */
	private int forBigData;
	/**
	 * 是否是历史查询1：是，0：不是
	 */
	private int isHistory;
	/**
	 * hdfs路径
	 */
	private String path;
	/**
	 * hdfs更新路径
	 */
	private String newPath;
	/**
	 * 读取hdfs文件时的编码，可以选为UTF-8,GBK
	 */
	private String charsetName;
	/**
	 * 文件名过滤
	 */
	private String filefilter;
	/**
	 * 执行的任务的运行状态
	 */
	private String runningState;
	/**
	 * 排序字段
	 */
	private String orderBy;
	/**
	 * 正序还是倒序
	 */
	private String orderRule;
	/**
	 * 导入目标表的分区
	 */
	private String patitionName;
	/**
	 * 是否覆盖：yes,no
	 */
	private String overwrite;
	/**
	 * 是否创建临时表
	 */
	private boolean createdTmpTable;

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public int getStartIndex() {
		return (page - 1) * pageSize;
	}

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

	public int getConnId() {
		return ConnId;
	}

	public void setConnId(int connId) {
		ConnId = connId;
	}

	public int getQueryIndex() {
		return queryIndex;
	}

	public void setQueryIndex(int queryIndex) {
		this.queryIndex = queryIndex;
	}

	public CustomConnection getCustomConnection() {
		return customConnection;
	}

	public void setCustomConnection(CustomConnection customConnection) {
		this.customConnection = customConnection;
	}

	public int getDbId() {
		return dbId;
	}

	public void setDbId(int dbId) {
		this.dbId = dbId;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

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

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		sql = sql.trim();
		if (sql.endsWith(";")) {
			this.sql = sql.substring(0, sql.length() - 1);
		} else {
			this.sql = sql;
		}
	}

	public String getProxyUserName() {
		return proxyUserName;
	}

	public void setProxyUserName(String proxyUserName) {
		this.proxyUserName = proxyUserName;
	}

	public String getQueryKey() {
		return queryKey;
	}

	public void setQueryKey(String queryKey) {
		this.queryKey = queryKey;
	}

	public String getQueryCountKey() {
		return queryCountKey;
	}

	public void setQueryCountKey(String queryCountKey) {
		this.queryCountKey = queryCountKey;
	}

	public String getLogKey() {
		return logKey;
	}

	public void setLogKey(String logKey) {
		this.logKey = logKey;
	}

	public String getDbName() {
		if (StringUtils.isEmpty(dbName)) {
			return "default";
		} else {
			return dbName;
		}
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public String getParamString() {
		return paramString;
	}

	public void setParamString(String paramString) {
		this.paramString = paramString;
	}

	public int getForBigData() {
		return forBigData;
	}

	public void setForBigData(int forBigData) {
		this.forBigData = forBigData;
	}

	public int getIsHistory() {
		return isHistory;
	}

	public void setIsHistory(int isHistory) {
		this.isHistory = isHistory;
	}

	public String getOrginal_sql() {
		return orginal_sql;
	}

	public void setOrginal_sql(String orginal_sql) {
		this.orginal_sql = orginal_sql;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		if (StringUtils.isNotBlank(path)) {
			try {
				this.path = URLDecoder.decode(URLDecoder.decode(path, "UTF-8"),
						"UTF-8");
				if (!this.path.startsWith("/")) {
					this.path = "/" + this.path;
				}
			} catch (UnsupportedEncodingException e) {
				logger.error(e, e);
			}
		}
	}

	public void setPathWithoutEncoding(String path) {
		this.path = path;
		if (!this.path.startsWith("/")) {
			this.path = "/" + this.path;
		}
	}

	public String getNewPath() {
		return newPath;
	}

	public void setNewPath(String newPath) {
		if (StringUtils.isNotBlank(newPath)) {
			try {
				this.newPath = URLDecoder.decode(
						URLDecoder.decode(newPath, "UTF-8"), "UTF-8");
				if (!this.newPath.startsWith("/")) {
					this.newPath = "/"+this.newPath;
				}
			} catch (UnsupportedEncodingException e) {
				logger.error(e, e);
			}
		}
	}

	public void setNewPathWithoutEncoding(String newPath) {
		this.newPath = newPath;
	}

	public String getCharsetName() {
		return charsetName;
	}

	public void setCharsetName(String charsetName) {
		this.charsetName = charsetName;
	}

	public String getFilefilter() {
		return filefilter;
	}

	public void setFilefilter(String filefilter) {
		this.filefilter = filefilter;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	public String getRunningState() {
		return runningState;
	}

	public void setRunningState(String runningState) {
		this.runningState = runningState;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public String getOrderRule() {
		return orderRule;
	}

	public void setOrderRule(String orderRule) {
		this.orderRule = orderRule;
	}

	public String getPatitionName() {
		return patitionName;
	}

	public void setPatitionName(String patitionName) {
		this.patitionName = patitionName;
	}

	public String getOverwrite() {
		return overwrite;
	}

	public void setOverwrite(String overwrite) {
		this.overwrite = overwrite;
	}

	public boolean isCreatedTmpTable() {
		return createdTmpTable;
	}

	public void setCreatedTmpTable(boolean createdTmpTable) {
		this.createdTmpTable = createdTmpTable;
	}

	@Override
	public String toString() {
		return JSONObject.toJSONString(this);
	}

}
