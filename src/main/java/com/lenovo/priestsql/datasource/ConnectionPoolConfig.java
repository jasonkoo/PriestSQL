package com.lenovo.priestsql.datasource;


public final class ConnectionPoolConfig {
	private String url;
	private String username;
	private String password;
	private String driver;
	private int connectionMaxIdleTime = 5 * 60 * 1000;
	private boolean waitConnection = true;
	private long waitConnectionTime = -1;
	private int maxConnectionCount = 5;
	private long idleConnectionCheckIntervalTime = connectionMaxIdleTime;
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getConnectionMaxIdleTime() {
		return connectionMaxIdleTime;
	}
	public void setConnectionMaxIdleTime(int connectionMaxIdleTime) {
		this.connectionMaxIdleTime = connectionMaxIdleTime;
	}
	public boolean isWaitConnection() {
		return waitConnection;
	}
	public void setWaitConnection(boolean waitConnection) {
		this.waitConnection = waitConnection;
	}
	public long getWaitConnectionTime() {
		return waitConnectionTime;
	}
	public void setWaitConnectionTime(long waitConnectionTime) {
		this.waitConnectionTime = waitConnectionTime;
	}
	public int getMaxConnectionCount() {
		return maxConnectionCount;
	}
	public void setMaxConnectionCount(int maxConnectionCount) {
		this.maxConnectionCount = maxConnectionCount;
	}
	public long getIdleConnectionCheckIntervalTime() {
		return idleConnectionCheckIntervalTime;
	}
	public void setIdleConnectionCheckIntervalTime(
			long idleConnectionCheckIntervalTime) {
		this.idleConnectionCheckIntervalTime = idleConnectionCheckIntervalTime;
	}
	public String getDriver() {
		return driver;
	}
	public void setDriver(String driver) {
		this.driver = driver;
	}
}