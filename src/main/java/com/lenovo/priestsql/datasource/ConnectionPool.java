package com.lenovo.priestsql.datasource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Queue;

import org.apache.log4j.Logger;
import org.jboss.netty.util.internal.ConcurrentHashMap;

/**
 * Connection pool
 * 
 * @author luojiang2
 */
final class ConnectionPool {
	private static final Logger LOG = Logger.getLogger(ConnectionPool.class);
	private final ConnectionPoolConfig config;
	private final ConnectionProxyServer proxyServer = new ConnectionProxyServer();
	// Proxy connections
	private final Queue<Connection> proxyConnections = new LinkedList<Connection>();
	// Real physical connections.Key is proxy object and value is real physical
	// connection
	private final Map<Connection, Connection> proxyRealConnectionsMap = new HashMap<Connection, Connection>();
	// Idle connections.Key is proxy connection object and value is idle time of
	// proxy connection object.
	private final Map<Connection, Long> idleConnections = new ConcurrentHashMap<Connection, Long>();
	// Created connection count
	private int createdCount = 0;
	private int lentCount = 0;
	private volatile boolean closed = false;
	private final Object lock = new Object();

	protected ConnectionPool(ConnectionPoolConfig config) {
		this.config = config;
	}

	/**
	 * Get Connection
	 * 
	 * @return May be null
	 * @throws SQLException
	 */
	public Connection getConnection(String proxyUser) throws SQLException {
		synchronized (this.lock) {
			if (closed) {
				throw new SQLException("Connection pool is closed");
			}
			Connection proxy = getAvailableConnection();
			if (proxy == null) {
				if (this.createdCount < this.config.getMaxConnectionCount()) {
					proxy = create(proxyUser);
					if (proxy != null) {
						++this.createdCount;
					}
				} else {
					proxy = waitConnection();
				}
			}
			if (proxy != null) {
				++lentCount;
				this.idleConnections.remove(proxy);
			}
			return proxy;
		}
	}

	private Connection getAvailableConnection() throws SQLException {
		boolean remoteIsClosed = false;
		Connection proxy = null;
		do {
			proxy = proxyConnections.poll();
			if (proxy == null) {
				return null;
			} else {
				Connection real = this.proxyRealConnectionsMap.get(proxy);
				if (real == null||(remoteIsClosed = real.isClosed())) {
					this.proxyRealConnectionsMap.remove(proxy);
					this.proxyConnections.remove(proxy);
					this.idleConnections.remove(proxy);
				}
			}
		} while (remoteIsClosed);
		return proxy;
	}

	/*
	 * Create physical connection
	 * 
	 * @return
	 */
	private Connection create(String proxyUser) throws SQLException {
		try {
			String url = this.config.getUrl()
					+ (proxyUser != null ? proxyUser : "");
			Connection realConnection = null;
			Connection proxyConnection=null;
			for (int i = 0; i < 3; i++) {
				try{
					realConnection=createConnection(url);
				}catch(Exception e){
					if(i==2){
						//尝试的最后一次将错误抛出
						throw e;
					}
				}
				if(realConnection!=null&&!realConnection.isClosed()){
					proxyConnection = this.proxyServer.getConnectionProxy(
							realConnection, this);
					proxyRealConnectionsMap.put(proxyConnection, realConnection);
					break;
				}
			}
			return proxyConnection;
		} catch (SQLException e) {
			LOG.error("Failed to create Connection", e);
			throw e;
		}
	}

	private Connection createConnection(String url) throws SQLException  {
		Connection realConnection = DriverManager.getConnection(url,
				this.config.getUsername(), this.config.getPassword());
		return realConnection;
	}
	/*
	 * Wait available connection
	 * 
	 * @return
	 */
	private Connection waitConnection() {
		if (this.config.isWaitConnection()) {
			long waitConnectionTime = this.config.getWaitConnectionTime();
			try {
				if (waitConnectionTime <= 0) {
					this.lock.wait();
				} else {
					this.lock.wait(waitConnectionTime);
				}
				return this.proxyConnections.poll();
			} catch (InterruptedException i) {
				LOG.error("Occur an interrupted exception when wait available connection");
				return null;
			}
		} else {
			return null;
		}
	}

	protected void returnConnection(Connection connection) throws SQLException {
		synchronized (this.lock) {
			if (connection != null) {
				--this.lentCount;
				this.proxyConnections.add(connection);
				this.idleConnections
						.put(connection, System.currentTimeMillis());
				this.lock.notifyAll();
			}
		}
	}

	/**
	 * Check idle connections
	 */
	void checkIdleConnections() {
		synchronized (this.lock) {
			Iterator<Entry<Connection, Long>> iter = this.idleConnections
					.entrySet().iterator();
			while (iter.hasNext()) {
				Entry<Connection, Long> entry = iter.next();
				Connection proxy = entry.getKey();
				long idleTime = System.currentTimeMillis()
						- entry.getValue().longValue();
				if (idleTime > this.config.getConnectionMaxIdleTime()) {
					Connection real = this.proxyRealConnectionsMap
							.remove(proxy);
					try {
						// Close physical connection
						if(real!=null){
							real.close();
						}
						// Remove proxy connection
						this.proxyConnections.remove(proxy);
						// Remove idle connection
						iter.remove();
					} catch (Exception e) {
						LOG.error("Failed to close connection", e);
					}
				}

			}
			if (this.lentCount == 0 && this.proxyRealConnectionsMap.size() == 0) {
				// this.closed = true;
				this.proxyConnections.clear();
				this.idleConnections.clear();
			}
		}
	}

	/**
	 * Close all physical connection
	 */
	void close() {
		synchronized (this.lock) {
			this.closed = true;
			this.proxyRealConnectionsMap.forEach((proxy, real) -> {
				try {
					real.close();
				} catch (SQLException e) {
					LOG.error("Failed to close connection", e);
				}
			});
			this.proxyConnections.clear();
			this.idleConnections.clear();
		}
	}

	boolean isClosed() {
		return this.closed;
	}
}