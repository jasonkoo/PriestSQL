package com.lenovo.priestsql.task;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.service.AbstractService;

/**
 * Task executor server
 * @author luojiang2
 */
public class TaskServer extends AbstractService {
	private static final Logger LOG = Logger.getLogger(TaskServer.class);
	private ThreadPoolExecutor taskExecutor;
	
	public TaskServer() {
		super("TaskServer");
	}
	
	/**
	 * Get task executor to execute task
	 * @return
	 */
	public ThreadPoolExecutor getTaskExecutor() {
		return taskExecutor;
	}

	@Override
	protected void initService() {
		int corePoolSize = getConfig().getInt(PriestSqlConfiguration.TASK_HANDLE_THREAD_CORE_COUNT,
				PriestSqlConfiguration.TASK_HANDLE_THREAD_CORE_COUNT_DEFAULT);
		int maximumPoolSize = getConfig().getInt(PriestSqlConfiguration.TASK_HANDLE_THREAD_MAX_COUNT,
				PriestSqlConfiguration.TASK_HANDLE_THREAD_MAX_COUNT_DEFAULT);
		BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<Runnable>();
		taskExecutor = new TaskExecutor(corePoolSize, maximumPoolSize,Long.MAX_VALUE,TimeUnit.SECONDS,workQueue,new TaskExecutorThreadFactory());
		taskExecutor.allowCoreThreadTimeOut(true);
	}

	@Override
	protected void startService(){
		LOG.info(getName()+" is started.");
	}

	@Override
	protected void stopService() {
		boolean waitAllTasksCompleted = getConfig().getBoolean(PriestSqlConfiguration.WAIT_ALL_TASKS_COMPLETED,
				PriestSqlConfiguration.WAIT_ALL_TASKS_COMPLETED_DEFAULT);
		boolean waitRunningTaskCompleted = getConfig().getBoolean(PriestSqlConfiguration.WAIT_RUNNING_TASKS_COMPLETED,
				PriestSqlConfiguration.WAIT_RUNNING_TASKS_COMPLETED_DEFAULT);
		if(waitAllTasksCompleted || waitRunningTaskCompleted){
			int runningCount = this.taskExecutor.getActiveCount();
			int waitCount = this.taskExecutor.getQueue().size();
			if(waitAllTasksCompleted){
				LOG.info(getName()+" will be stopped.But will wait for all tasks completed." +
						"There are "+runningCount+" running tasks and " + waitCount + " waitting tasks.");
				try {
					this.taskExecutor.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
				} catch (InterruptedException e) {
					LOG.error(e);
				}
			}else{
				LOG.info(getName()+" will be stopped.But will wait for running tasks completed." +
						"There are "+runningCount+" running tasks and " + waitCount + " waitting tasks.");
				boolean storeWaitingTasks = getConfig().getBoolean(PriestSqlConfiguration.STORE_WAITING_TASK_WEHN_TASKSERVER_STOP,
						PriestSqlConfiguration.STORE_WAITING_TASK_WEHN_TASKSERVER_STOP_DEFAULT);
				if(storeWaitingTasks){
					storeWaitingTasks();
				}
				this.taskExecutor.shutdown();
			}
			LOG.info(getName()+" is stopped.");
		}else{
			LOG.info(getName()+" is stopped immediately.");
			this.taskExecutor.shutdownNow();
		}
	}
	
	private void storeWaitingTasks() {
		List<Runnable> taskList = new ArrayList<Runnable>();
		BlockingQueue<Runnable> workQueue = taskExecutor.getQueue();
		while(!workQueue.isEmpty()){
			taskList.add(workQueue.remove());
		}
		//store tasks
	}

	class TaskExecutorThreadFactory implements ThreadFactory{
		private static final String THREAD_PREFIX = "task_executor_";
		private ThreadGroup threadGroup;
		
		TaskExecutorThreadFactory(){
			SecurityManager sm = System.getSecurityManager();
			if(sm != null){
				threadGroup = sm.getThreadGroup();
			}else{
				threadGroup = new ThreadGroup("task_executor_group");
			}
		}
		@Override
		public Thread newThread(Runnable r) {
			Thread thread = new Thread(this.threadGroup, r);
			thread.setName(THREAD_PREFIX+thread.getId());
			thread.setDaemon(false);
			return thread;
		}
	}
}