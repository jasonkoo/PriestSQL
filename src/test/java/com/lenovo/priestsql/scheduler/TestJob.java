package com.lenovo.priestsql.scheduler;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
import org.quartz.SchedulerException;
import org.quartz.UnableToInterruptJobException;

import com.lenovo.priestsql.PriestSqlConfiguration;

@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class TestJob implements InterruptableJob {

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		/*while(true){
			try {
				int count = context.getJobDetail().getJobDataMap().getInt("count");
				if(count == 10){
					break;
				}
				context.getJobDetail().getJobDataMap().put("count", ++count);
				System.out.println("hello quartz");
				Thread.sleep(2000L);
			} catch (InterruptedException e) {}
		}*/
		
		System.out.println("hello quartz");
	}
	
	@Override
	public void interrupt() throws UnableToInterruptJobException {
		System.out.println("Interrupt job");
	}
	
	public static void main(String[] args) throws SchedulerException, InterruptedException {
		SchedulerServer ss = SchedulerServer.getInstance();
		ss.init(new PriestSqlConfiguration());
		ss.start();
		/*Scheduler scheduler = ss.getScheduler();
		
		
		JobDataMap jdm = new JobDataMap();
		jdm.put("count", 0);
		JobDetail jd = JobBuilder.newJob(TestJob.class)
				.withIdentity("job1","priestsql")
				.storeDurably(true)
				.requestRecovery(true)
				.setJobData(jdm)
				.build();
		
		scheduler.resumeTrigger(new TriggerKey("trigger1","priestsql"));
		Trigger trigger = TriggerBuilder.newTrigger()
				.forJob(jd)
				.withIdentity("trigger1","priestsql")
				.withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
				.build();
		scheduler.scheduleJob(jd, trigger);*/
		//scheduler.rescheduleJob(new TriggerKey("trigger1","priestsql"), trigger);
	}
}