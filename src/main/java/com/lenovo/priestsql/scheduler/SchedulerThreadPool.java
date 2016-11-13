package com.lenovo.priestsql.scheduler;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

import org.apache.tomcat.util.threads.ThreadPoolExecutor;
import org.quartz.SchedulerConfigException;
import org.quartz.spi.ThreadPool;

public final class SchedulerThreadPool implements ThreadPool {
	private int core;
	private int max;
	private ThreadPoolExecutor executor;
	private final Object lock = new Object();
	
	public void setCore(int core) {
		this.core = core;
	}
	public void setMax(int max) {
		this.max = max;
	}

	@Override
	public boolean runInThread(Runnable runnable) {
		this.executor.execute(runnable);
		return true;
	}

	@Override
	public int blockForAvailableThreads() {
		synchronized (this.lock) {
			while(this.executor.getActiveCount() == this.max){
				try {
					this.lock.wait(500);
				} catch (InterruptedException ignor) {}
			}
			return this.max - this.executor.getActiveCount();
		}
	}

	@Override
	public void initialize() throws SchedulerConfigException {
		if(this.core <=0 || this.max <=0 || this.core > this.max){
			throw new IllegalArgumentException();
		}
		this.executor = new ThreadPoolExecutor(this.core, this.max,Long.MAX_VALUE,TimeUnit.SECONDS,
				new LinkedBlockingQueue<Runnable>(this.max),new SchedulerThreadFactory());
	}

	@Override
	public void shutdown(boolean waitForJobsToComplete) {
		if(waitForJobsToComplete){
			try {
				this.executor.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
			} catch (InterruptedException ignor) {}
		}else{
			this.executor.shutdownNow();
		}
	}

	@Override
	public int getPoolSize() {
		return this.max;
	}

	@Override
	public void setInstanceId(String schedInstId) {
	}

	@Override
	public void setInstanceName(String schedName) {
	}
	
	class SchedulerThreadFactory implements ThreadFactory{
        private final ThreadGroup group;
        private final String namePrefix;

        SchedulerThreadFactory() {
            SecurityManager s = System.getSecurityManager();
            group = (s != null) ? s.getThreadGroup() : Thread.currentThread().getThreadGroup();
            namePrefix = "scheduler-handler-thread-";
        }

        public Thread newThread(Runnable r) {
            Thread t = new Thread(group, r);
            t.setName(namePrefix+t.getId());
            t.setDaemon(false);
            t.setPriority(Thread.NORM_PRIORITY);
            return t;
        }
	}
}