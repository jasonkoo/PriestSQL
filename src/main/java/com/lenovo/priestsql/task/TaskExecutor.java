package com.lenovo.priestsql.task;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Task executor
 * @author luojiang2
 *
 */
public class TaskExecutor extends ThreadPoolExecutor {
	public TaskExecutor(int corePoolSize, int maximumPoolSize,
			long keepAliveTime, TimeUnit unit,
			BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory) {
		super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,threadFactory);
	}

	@Override
	protected void beforeExecute(Thread t, Runnable r) {
		if(AbstractTask.class.isAssignableFrom(r.getClass())){
			AbstractTask task = (AbstractTask)r;
			task.setStartTime(System.currentTimeMillis());
		}
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		if(AbstractTask.class.isAssignableFrom(r.getClass())){
			AbstractTask task = (AbstractTask)r;
			task.setFinishTime(System.currentTimeMillis());
			task.setThrowable(t);
			task.setTaskState(TaskState.FAILED);
		}
	}
}