package com.lenovo.priestsql.scheduler;

import java.util.Properties;

import org.apache.hadoop.conf.Configuration;
import org.apache.log4j.Logger;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;

import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.service.AbstractService;

public final class SchedulerServer extends AbstractService {
	private static final  Logger LOG = Logger.getLogger(SchedulerServer.class);
	private static SchedulerServer ss = new SchedulerServer();
	private static final StdSchedulerFactory schedulerFactory = new StdSchedulerFactory();
	private Scheduler scheduler;
	
	private SchedulerServer() {
		super("SchedulerServer");
	}
	
	public static SchedulerServer getInstance(){
		return ss;
	}
	
	public Scheduler getScheduler(){
		if(getState() != STATE.STARTED){
			throw new RuntimeException(getName()+" state is " + getState().getStatename()+ ".Can't obtain Scheduler");
		}
		return scheduler;
	}
	
	@Override
	protected void initService() {
		Properties props = new Properties();
		Configuration config = this.getConfig();
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_CLASS,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_CLASS,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_CLASS_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_DRIVER,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_DRIVER,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_DRIVER_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_MAX_CONNECTIONS,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_MAX_CONNECTIONS,
				String.valueOf(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_MAX_CONNECTIONS_DEFAULT)));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_PASSWORD,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_PASSWORD,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_PASSWORD_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_URL,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_URL,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_URL_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_USER,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_USER,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DATASOURCE_USER_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_DRIVER_DELEGATE_CLASS,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_DRIVER_DELEGATE_CLASS,
				PriestSqlConfiguration.QUARTZ_JOBSTORE_DRIVER_DELEGATE_CLASS_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_IS_CLUSTER,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_IS_CLUSTER,
				String.valueOf(PriestSqlConfiguration.QUARTZ_JOBSTORE_IS_CLUSTER_DEFAULT)));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_MISFIRE_THRESHOLD,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_MISFIRE_THRESHOLD,
				String.valueOf(PriestSqlConfiguration.QUARTZ_JOBSTORE_MISFIRE_THRESHOLD_DEFAULT)));
		props.put(PriestSqlConfiguration.QUARTZ_JOBSTORE_USE_PROPERTIES,config.get(PriestSqlConfiguration.QUARTZ_JOBSTORE_USE_PROPERTIES,
				String.valueOf(PriestSqlConfiguration.QUARTZ_JOBSTORE_USE_PROPERTIES_DEFAULT)));
		props.put(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID,config.get(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID,
				PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID_GENERATOR,config.get(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID_GENERATOR,
				PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_ID_GENERATOR_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_NAME,config.get(PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_NAME,
				PriestSqlConfiguration.QUARTZ_SCHEDULER_INSTANCE_NAME_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_SCHEDULER_THREAD_NAME,config.get(PriestSqlConfiguration.QUARTZ_SCHEDULER_THREAD_NAME,
				PriestSqlConfiguration.QUARTZ_SCHEDULER_THREAD_NAME_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_THREAD_POOL_CLASS,config.get(PriestSqlConfiguration.QUARTZ_THREAD_POOL_CLASS,
				PriestSqlConfiguration.QUARTZ_THREAD_POOL_CLASS_DEFAULT));
		props.put(PriestSqlConfiguration.QUARTZ_THREAD_POOL_CORE,config.get(PriestSqlConfiguration.QUARTZ_THREAD_POOL_CORE,
				String.valueOf(PriestSqlConfiguration.QUARTZ_THREAD_POOL_CORE_DEFAULT)));
		props.put(PriestSqlConfiguration.QUARTZ_THREAD_POOL_MAX,config.get(PriestSqlConfiguration.QUARTZ_THREAD_POOL_MAX,
				String.valueOf(PriestSqlConfiguration.QUARTZ_THREAD_POOL_MAX_DEFAULT)));
		try {
			schedulerFactory.initialize(props);
			scheduler = schedulerFactory.getScheduler();
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void startService() {
		try {
			LOG.info("Begin to start schedule server");
			scheduler.start();
			LOG.info("Scheduler server is started");
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void stopService() {
		try {
			LOG.info("Begin to stop schedule server");
			scheduler.shutdown(this.getConfig().getBoolean(PriestSqlConfiguration.WAIT_QUARTZ_SCHEDULER_TASKS_COMPLETED,
					PriestSqlConfiguration.WAIT_QUARTZ_SCHEDULER_TASKS_COMPLETED_DEFAULT));
			LOG.info("Scheduler server is stopped");
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}
}