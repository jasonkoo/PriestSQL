package com.lenovo.priestsql.schedule.listener;

import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;

/**
 * Created by zhengwei16 on 2016/9/8.
 */
public class QueryJobListener implements JobListener{
	/**
	 * <p>
	 * Get the name of the <code>JobListener</code>.
	 * </p>
	 */
	@Override
	public String getName() {
		return QueryJobListener.class.getSimpleName();
	}

	/**
	 * <p>
	 * Called by the <code>Scheduler</code> when a <code>JobDetail</code>
	 * is about to be executed (an associated <code>Trigger</code>
	 * has occurred).
	 * </p>
	 * <p>
	 * <p>
	 * This method will not be invoked if the execution of the Job was vetoed
	 * by a <code>TriggerListener</code>.
	 * </p>
	 *
	 * @param context
	 * @see #jobExecutionVetoed(JobExecutionContext)
	 */
	@Override
	public void jobToBeExecuted(JobExecutionContext context) {

	}

	/**
	 * <p>
	 * Called by the <code>Scheduler</code> when a <code>JobDetail</code>
	 * was about to be executed (an associated <code>Trigger</code>
	 * has occurred), but a <code>TriggerListener</code> vetoed it's
	 * execution.
	 * </p>
	 *
	 * @param context
	 * @see #jobToBeExecuted(JobExecutionContext)
	 */
	@Override
	public void jobExecutionVetoed(JobExecutionContext context) {

	}

	/**
	 * <p>
	 * Called by the <code>Scheduler</code> after a <code>{@link JobDetail}</code>
	 * has been executed, and be for the associated <code>Trigger</code>'s
	 * <code>triggered(xx)</code> method has been called.
	 * </p>
	 *
	 * @param context
	 * @param jobException
	 */
	@Override
	public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {

	}
}
