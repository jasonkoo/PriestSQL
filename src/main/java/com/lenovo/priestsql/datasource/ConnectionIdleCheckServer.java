package com.lenovo.priestsql.datasource;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ConnectionIdleCheckServer implements Runnable{
	private final Map<String, ConnectionPool> pools;
	private final long idleConnectionCheckIntervalTime;
	private Thread  worker;
	private volatile boolean running = true;
	
	protected ConnectionIdleCheckServer(Map<String, ConnectionPool> pools,long idleConnectionCheckIntervalTime) {
		this.pools = pools;
		this.idleConnectionCheckIntervalTime = idleConnectionCheckIntervalTime;
		this.worker = new Thread(this);
		this.worker.setName("connection-pools-monitor");
		this.worker.setDaemon(true);
		this.worker.start();
	}

	@Override
	public void run() {
		List<String> closedPools = new ArrayList<String>();
		while(this.running && !this.worker.isInterrupted()){
			try {
				Thread.sleep(this.idleConnectionCheckIntervalTime);
				pools.forEach((k,v) -> {
					if(!v.isClosed()){
						v.checkIdleConnections();
					}else{
						closedPools.add(k);
					}
				});
				closedPools.forEach(item -> this.pools.remove(item));
			} catch (InterruptedException e) {/*Do nothing*/}
		}
	}

	protected void stop() {
		this.running = false;
	}
}