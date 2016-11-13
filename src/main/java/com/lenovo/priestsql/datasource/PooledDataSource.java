package com.lenovo.priestsql.datasource;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Logger;

import javax.sql.DataSource;

public class PooledDataSource implements DataSource{
	private static final ThreadLocal<String> hiveServer2ProxyUsers = new ThreadLocal<String>();
	//==========Connection pool configuration=========
	private final ConnectionPoolConfig config;
	//================================================
	private ConnectionIdleCheckServer idleConnectionChecker;
	//================================================
	private final ReentrantLock lock = new ReentrantLock();
	
	private Map<String, ConnectionPool> pools = new HashMap<String, ConnectionPool>();
	
	public PooledDataSource(ConnectionPoolConfig config) {
		this.config = config;
		try {
		    Class.forName(config.getDriver());
	    } catch (ClassNotFoundException e) {
	    	throw new RuntimeException("Failed to initialize PooledDataSource", e);
	    }
		checkArguments();
		this.idleConnectionChecker = new ConnectionIdleCheckServer(this.pools,this.config.getIdleConnectionCheckIntervalTime());
	}
	
	private void checkArguments() {
		if(this.config.getIdleConnectionCheckIntervalTime() < this.config.getConnectionMaxIdleTime()){
			throw new RuntimeException("Illegal argument.IdleConnectionCheckIntervalTime value must be"
					+ " greater than or equal to connectionMaxIdleTime value");
		}
	}

	public void close() {
		if(this.idleConnectionChecker != null){
			this.idleConnectionChecker.stop();
		}
		pools.forEach((k,v) -> v.close());
	}
	
	/**
	 * @param proxyUser
	 */
	public void setHiveServer2ProxyUser(String proxyUser){
		hiveServer2ProxyUsers.set(proxyUser);
	}

	@Override
	public Connection getConnection() throws SQLException {
		String proxyUser = hiveServer2ProxyUsers.get();
		try{
			ConnectionPool pool = pools.get(proxyUser);
			if(pool == null){
				lock.lock();
				try{
					if(pool == null){
						pool = new ConnectionPool(this.config);
						pools.put(proxyUser, pool);
					}
				}finally{
					lock.unlock();
				}
			}
			return pool.getConnection(proxyUser);
		}finally{
			hiveServer2ProxyUsers.remove();
		}
	}

//==========Method is not supported===========
	@Override
	public Connection getConnection(String username, String password) throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public void setLoginTimeout(int seconds) throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public int getLoginTimeout() throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public PrintWriter getLogWriter() throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public void setLogWriter(PrintWriter out) throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public Logger getParentLogger() throws SQLFeatureNotSupportedException {
		throw new UnsupportedOperationException();
	}
	@Override
	public <T> T unwrap(Class<T> iface) throws SQLException {
		throw new UnsupportedOperationException();
	}
	@Override
	public boolean isWrapperFor(Class<?> iface) throws SQLException {
		throw new UnsupportedOperationException();
	}
}