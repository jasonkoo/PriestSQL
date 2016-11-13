package com.lenovo.priestsql.schedule.job;

import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.job.QueryJob;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.TriggerBuilder;

/**
 * Query job builder.The class includes <code>JobDetail</code> and
 * <code>Trigger</code> builder method.
 */
public final class QueryJobBuilder {
	
	/**
	 * 
	 * @param name
	 * @param group
	 * @param qe
	 * @return
	 */
	public static JobDetail jobDetailBuilder(String group,QueryEntity queryEntity) {
		return JobBuilder.newJob()
				   .ofType(QueryJob.class)
				   .withIdentity(queryEntity.getJobName(), group)
				   .requestRecovery()
				   .storeDurably()
				   .withDescription(queryEntity.getDescription())
				   .build();
	}

	/**
	 * @param jobDetail
	 * @param group
	 * @param queryEntity
	 * @return
	 */
	public static CronTrigger cronTriggerBuilder(JobDetail jobDetail,String group,QueryEntity queryEntity) {
		return TriggerBuilder.newTrigger()
				.forJob(jobDetail)
				.withIdentity(queryEntity.getJobName(), group)
				.withSchedule(CronScheduleBuilder.cronSchedule(queryEntity.getCronExpr()))
				.withDescription(queryEntity.getDescription())
			    .build();
	}
}
