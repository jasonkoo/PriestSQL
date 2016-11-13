package com.lenovo.priestsql;

import org.apache.hadoop.conf.Configuration;

public final class PriestSqlConfiguration extends Configuration {
	private static final String PRIESTSQL_SITE_CONFIGURATION = "priestsql-site-local.xml";

	static {
		Configuration.addDefaultResource(PRIESTSQL_SITE_CONFIGURATION);
	}

	public static final String WEBAPP_SERVER_THREADPOOL_CORE_SIZE = "webapp.server.threadpool.core.size";
	public static final int WEBAPP_SERVER_THREADPOOL_CORE_SIZE_DEFAULT = Runtime
			.getRuntime().availableProcessors();

	public static final String WEBAPP_SERVER_THREADPOOL_MAX_SIZE = "webapp.server.threadpool.max.size";
	public static final int WEBAPP_SERVER_THREADPOOL_MAX_SIZE_DEFAULT = Runtime
			.getRuntime().availableProcessors() * 2;

	public static final String WEBAPP_SERVER_BIND_HOST = "webapp.server.bind.host";
	public static final String WEBAPP_SERVER_BIND_HOST_DEFAULT = "0.0.0.0";

	public static final String WEBAPP_SERVER_BIND_HTTPPORT = "webapp.server.bind.httpport";
	public static final int WEBAPP_SERVER_BIND_HTTPPORT_DEFAULT = 9796;

	public static final String WEBAPP_SERVER_WEB_RESOURCES_DIR = "webapp.server.web.resources.dir";
	public static final String WEBAPP_SERVER_WEB_RESOURCES_DIR_DEFAULT = "src/main/webapp";

	public static final String TASK_HANDLE_THREAD_CORE_COUNT = "task.handle.thread.core.count";
	public static final int TASK_HANDLE_THREAD_CORE_COUNT_DEFAULT = Runtime
			.getRuntime().availableProcessors() * 2;

	public static final String TASK_HANDLE_THREAD_MAX_COUNT = "task.handle.thread.max.count";
	public static final int TASK_HANDLE_THREAD_MAX_COUNT_DEFAULT = Runtime
			.getRuntime().availableProcessors() * 4;

	public static final String WAIT_ALL_TASKS_COMPLETED = "wait.all.tasks.completed";
	public static final boolean WAIT_ALL_TASKS_COMPLETED_DEFAULT = false;

	public static final String WAIT_RUNNING_TASKS_COMPLETED = "wait.running.tasks.completed";
	public static final boolean WAIT_RUNNING_TASKS_COMPLETED_DEFAULT = false;

	public static final String STORE_WAITING_TASK_WEHN_TASKSERVER_STOP = "store.waiting.task.when.taskserver.stop";
	public static final boolean STORE_WAITING_TASK_WEHN_TASKSERVER_STOP_DEFAULT = false;

	public static final String JMX_AGENT_BIND_HOST = "jmx.server.bind.host";
	public static final String JMX_AGENT_BIND_HOST_DEFAULT = "0.0.0.0";

	public static final String JMX_AGENT_BIND_PORT = "jmx.server.bind.port";
	public static final int JMX_AGENT_BIND_PORT_DEFAULT = 9797;

	public static final String JMX_ENABLE = "jmx.enable";
	public static final boolean JMX_ENABLE_DEFAULT = true;

	/**
	 * Support none and basic
	 */
	public static final String JMX_HTTPADAPTOR_AUTH_METHOD = "jmx.httpadaptor.auth.method";
	public static final String JMX_HTTPADAPTOR_AUTH_METHOD_DEFAULT = "basic";

	public static final String JMX_HTTPADAPTOR_USERNAME = "jmx.httpadaptor.username";
	public static final String JMX_HTTPADAPTOR_USERNAME_DEFAULT = "priestsql";

	public static final String JMX_HTTPADAPTOR_PASSWORD = "jmx.httpadaptor.password";
	public static final String JMX_HTTPADAPTOR_PASSWORD_DEFAULT = "priestsql";

	// Quartz configuration
	public static final String SCHEDULE_ENABLE = "schedule.enable";
	public static final boolean SCHEDULE_ENABLE_DEFAULT = true;

	public static final String QUARTZ_SCHEDULER_INSTANCE_NAME = "org.quartz.scheduler.instanceName";
	public static final String QUARTZ_SCHEDULER_INSTANCE_NAME_DEFAULT = "PRIESTSQL";

	public static final String QUARTZ_SCHEDULER_INSTANCE_ID = "org.quartz.scheduler.instanceId";
	public static final String QUARTZ_SCHEDULER_INSTANCE_ID_DEFAULT = QUARTZ_SCHEDULER_INSTANCE_NAME_DEFAULT;

	public static final String QUARTZ_JOB_GROUP_NAME = "org.quartz.job.group.name";
	public static final String QUARTZ_JOB_GROUP_NAME_DEFAULT = QUARTZ_SCHEDULER_INSTANCE_ID_DEFAULT;

	public static final String QUARTZ_SCHEDULER_INSTANCE_ID_GENERATOR = "org.quartz.scheduler.instanceIdGenerator.class";
	public static final String QUARTZ_SCHEDULER_INSTANCE_ID_GENERATOR_DEFAULT = "org.quartz.simpl.SimpleInstanceIdGenerator";

	public static final String QUARTZ_SCHEDULER_THREAD_NAME = "org.quartz.scheduler.threadName";
	public static final String QUARTZ_SCHEDULER_THREAD_NAME_DEFAULT = "QUARTZ_SCHEDULER";

	public static final String QUARTZ_THREAD_POOL_CLASS = "org.quartz.threadPool.class";
	public static final String QUARTZ_THREAD_POOL_CLASS_DEFAULT = "com.lenovo.priestsql.scheduler.SchedulerThreadPool";

	public static final String QUARTZ_THREAD_POOL_CORE = "org.quartz.threadPool.core";
	public static final int QUARTZ_THREAD_POOL_CORE_DEFAULT = Runtime
			.getRuntime().availableProcessors();

	public static final String QUARTZ_THREAD_POOL_MAX = "org.quartz.threadPool.max";
	public static final int QUARTZ_THREAD_POOL_MAX_DEFAULT = Runtime
			.getRuntime().availableProcessors() * 2;

	public static final String QUARTZ_JOBSTORE_CLASS = "org.quartz.jobStore.class";
	public static final String QUARTZ_JOBSTORE_CLASS_DEFAULT = "org.quartz.impl.jdbcjobstore.JobStoreTX";

	public static final String QUARTZ_JOBSTORE_USE_PROPERTIES = "org.quartz.jobStore.useProperties";
	public static final boolean QUARTZ_JOBSTORE_USE_PROPERTIES_DEFAULT = false;

	public static final String QUARTZ_JOBSTORE_MISFIRE_THRESHOLD = "org.quartz.jobStore.misfireThreshold";
	public static final long QUARTZ_JOBSTORE_MISFIRE_THRESHOLD_DEFAULT = 5 * 60 * 1000;

	public static final String QUARTZ_JOBSTORE_IS_CLUSTER = "org.quartz.jobStore.isClustered";
	public static final boolean QUARTZ_JOBSTORE_IS_CLUSTER_DEFAULT = true;

	public static final String QUARTZ_JOBSTORE_DRIVER_DELEGATE_CLASS = "org.quartz.jobStore.driverDelegateClass";
	public static final String QUARTZ_JOBSTORE_DRIVER_DELEGATE_CLASS_DEFAULT = "org.quartz.impl.jdbcjobstore.StdJDBCDelegate";

	public static final String QUARTZ_JOBSTORE_DATASOURCE = "org.quartz.jobStore.dataSource";
	public static final String QUARTZ_JOBSTORE_DATASOURCE_DEFAULT = "priestsql";

	public static final String QUARTZ_JOBSTORE_DATASOURCE_DRIVER = "org.quartz.dataSource.priestsql.driver";
	public static final String QUARTZ_JOBSTORE_DATASOURCE_DRIVER_DEFAULT = "com.mysql.jdbc.Driver";

	public static final String QUARTZ_JOBSTORE_DATASOURCE_URL = "org.quartz.dataSource.priestsql.URL";
	public static final String QUARTZ_JOBSTORE_DATASOURCE_URL_DEFAULT = "jdbc:mysql://192.168.100.136:3306/priestsql_independent?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8";

	public static final String QUARTZ_JOBSTORE_DATASOURCE_USER = "org.quartz.dataSource.priestsql.user";
	public static final String QUARTZ_JOBSTORE_DATASOURCE_USER_DEFAULT = "root";

	public static final String QUARTZ_JOBSTORE_DATASOURCE_PASSWORD = "org.quartz.dataSource.priestsql.password";
	public static final String QUARTZ_JOBSTORE_DATASOURCE_PASSWORD_DEFAULT = "lenovo";

	public static final String QUARTZ_JOBSTORE_DATASOURCE_MAX_CONNECTIONS = "org.quartz.dataSource.priestsql.maxConnections";
	public static final int QUARTZ_JOBSTORE_DATASOURCE_MAX_CONNECTIONS_DEFAULT = 20;

	public static final String WAIT_QUARTZ_SCHEDULER_TASKS_COMPLETED = "wait.quartz.scheduler.tasks.completed";
	public static final boolean WAIT_QUARTZ_SCHEDULER_TASKS_COMPLETED_DEFAULT = false;

	public static final String ALLOW_QUERY_RESULTS_WRITE_TO_LOCAL_DIR = "allow.query.results.write.to.loacl.dir";
	public static final boolean ALLOW_QUERY_RESULTS_WRITE_TO_LOCAL_DIR_DEFAULT = false;

	
	
	//system base configuration
	
	public static final String DATABASE_LOGIN_TIMEOUT = "datasource.login.timeout";
	public static final int DATABASE_LOGIN_TIMEOUT_DEFAULT = 10;

	public static final String DATASOURCE_MAIN_URL = "datasource.main.url";
	public static final String DATASOURCE_MAIN_URL_DEFAULT = "jdbc:mysql://10.0.64.52:3306/priestsql_independent?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8";

	public static final String DATASOURCE_MAIN_DRIVER = "datasource.main.driver";
	public static final String DATASOURCE_MAIN_DRIVER_DEFAULT = "com.mysql.jdbc.Driver";

	public static final String DATASOURCE_MAIN_USERNAME = "datasource.main.username";
	public static final String DATASOURCE_MAIN_USERNAME_DEFAULT = "u_duty";

	public static final String DATASOURCE_MAIN_PASSWORD = "datasource.main.password";
	public static final String DATASOURCE_MAIN_PASSWORD_DEFAULT = "System_12345";

	public static final String DATASOURCE_LEAPID_URL = "datasource.leapid.url";
	public static final String DATASOURCE_LEAPID_URL_DEFAULT = "jdbc:mysql://10.0.87.14:3306/leapid?characterEncoding=UTF-8";

	public static final String DATASOURCE_LEAPID_DRIVER = "datasource.leapid.driver";
	public static final String DATASOURCE_LEAPID_DRIVER_DEFAULT = "com.mysql.jdbc.Driver";

	public static final String DATASOURCE_LEAPID_USERNAME = "datasource.leapid.username";
	public static final String DATASOURCE_LEAPID_USERNAME_DEFAULT = "leapid_db";

	public static final String DATASOURCE_LEAPID_PASSWORD = "datasource.leapid.password";
	public static final String DATASOURCE_LEAPID_PASSWORD_DEFAULT = "";

	public static final String REDIS_HOST = "redis.host";
	public static final String REDIS_HOST_DEFAULT = "10.0.64.84";

	public static final String REDIS_PORT = "redis.port";
	public static final int REDIS_PORT_DEFAULT = 6380;

	public static final String REDIS_MAXIDLE = "redis.maxIdle";
	public static final int REDIS_MAXIDLE_DEFAULT = 25;

	public static final String REDIS_MAXTOTAL = "redis.maxTotal";
	public static final int REDIS_MAXTOTAL_DEFAULT = 200;

	public static final String REDIS_MAXWAIT = "redis.maxWait";
	public static final long REDIS_MAXWAIT_DEFAULT = 1000;

	public static final String REDIS_EXPIRTIME = "redis.expirtime";
	public static final int REDIS_EXPIRTIME_DEFAULT = 86400;

	public static final String QUERY_LIMIT = "query.limit";
	public static final int QUERY_LIMIT_DEFAULT = 1000;

	public static final String QUERY_LIMIT_BIG = "query.limit.big";
	public static final int QUERY_LIMIT_BIG_DEFAULT = 100000;

	public static final String HIVE_STRICT = "hive.strict";
	public static final boolean HIVE_STRICT_DEFAULT = true;

	public static final String USE_HADOOP_CONFIGURATION = "use.hadoop.configuration";
	public static final boolean USE_HADOOP_CONFIGURATION_DEFAULT = true;

	
	public static final String HADOOP_CORE_SITE="hadoop.core.site";
	public static final String HADOOP_CORE_SITE_DEFAULT="/etc/hadoop/conf/core-site.xml";

	public static final String HADOOP_HDFS_SITE="hadoop.hdfs.site";
	public static final String HADOOP_HDFS_SITE_DEFAULT="/etc/hadoop/conf/hdfs-site.xml";
	
	public static final String HDFS_ROOT_URI = "hdfs.root.uri";
	public static final String HDFS_ROOT_URI_DEFAULT = "hdfs://avatarcluster/";

	public static final String KERBEROS_AUTH_ENABLED = "kerberos.auth.enabled";
	public static final boolean KERBEROS_AUTH_ENABLED_DEFAULT = true;

	public static final String KERBEROS_REALM_FILE = "kerberos.realm.file";
	public static final String KERBEROS_REALM_FILE_DEFAULT = "yarn/spark9.lenovomm2.com@LENOVOMM2.COM";

	public static final String KERBEROS_REALM_QUERY = "kerberos.realm.query";
	public static final String KERBEROS_REALM_QUERY_DEFAULT = "priest/spark2.lenovomm2.com@LENOVOMM2.COM";

	public static final String KERBEROS_KEYTAB_FILEPATH_FILE = "kerberos.keytab.filepath.file";
	public static final String KERBEROS_KEYTAB_FILEPATH_FILE_DEFAULT = "/home/priestAdmin/keytabs/yarn.keytab";

	public static final String KERBEROS_KEYTAB_FILEPATH_QUERY = "kerberos.keytab.filepath.query";
	public static final String KERBEROS_KEYTAB_FILEPATH_QUERY_DEFAULT = "/home/priestAdmin/keytabs/priest.keytab";

	public static final String FILE_SAVE_PATH = "file.save.path";
	public static final String FILE_SAVE_PATH_DEFAULT = "/home/priestAdmin/priestsql/downloadFiles";

	public static final String LANGUAGE = "language";
	public static final String LANGUAGE_DEFAULT = "zh";
	public final static String CURRENT_APPLICATION_NAME = "sql";
}