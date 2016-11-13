package com.lenovo.priestsql;

import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

import com.lenovo.priestsql.jmx.JmxServer;
import com.lenovo.priestsql.scheduler.SchedulerServer;
import com.lenovo.priestsql.service.AbstractService;
import com.lenovo.priestsql.service.Service;
import com.lenovo.priestsql.task.TaskServer;
import com.lenovo.priestsql.webserver.WebAppServer;

import java.lang.Thread.UncaughtExceptionHandler;

/**
 * Launcher
 * 
 * @author luojiang2
 */
public final class ContextServer extends AbstractService implements ContextServerMBean {
	private static final Logger LOG = Logger.getLogger(ContextServer.class);
	// Singleton
	private static final ContextServer contextServer = new ContextServer();
	private final List<Service> services = new ArrayList<Service>();
	private PriestSqlConfiguration conf;
	// ============================================================
	// Open jmx server
	private boolean jmxEnable = true;
	//Open schedule server
	private boolean scheduleEnable = true;
	// Forbid the client submit task
	private boolean forbidSubmitTask = false;
	// The reason of forbidding the client submit task
	private String forbidSubmitTaskReasonEn;
	private String forbidSubmitTaskReasonZh;

	// ============================================================
	private TaskServer taskServer;
	
	private ContextServer() {
		super("ContextServer");
	}

	public static ContextServer getInstance() {
		return contextServer;
	}

	public TaskServer getTaskServer() {
		return this.taskServer;
	}

	public void setTaskServer(TaskServer taskServer) {
		this.taskServer = taskServer;
	}

	@Override
	public boolean getForbidSubmitTask() {
		return this.forbidSubmitTask;
	}

	@Override
	public void setForbidSubmitTask(boolean forbidSubmitTask) {
		this.forbidSubmitTask = forbidSubmitTask;
	}

	@Override
	public String getForbidSubmitTaskReasonEn() {
		return this.forbidSubmitTaskReasonEn;
	}

	@Override
	public void setForbidSubmitTaskReasonEn(String forbidSubmitTaskReasonEn) {
		this.forbidSubmitTaskReasonEn = forbidSubmitTaskReasonEn;
	}
	
	@Override
	public String getForbidSubmitTaskReasonZh() {
		return this.forbidSubmitTaskReasonZh;
	}

	@Override
	public void updateProperty(String name, String value) {
		this.conf.set(name, value);
	}

	@Override
	public void setForbidSubmitTaskReasonZh(String forbidSubmitTaskReasonZh) {
		this.forbidSubmitTaskReasonZh = forbidSubmitTaskReasonZh;
	}

	@Override
	protected void initService() {
		//Set database login timeout
		DriverManager.setLoginTimeout(conf.getInt(PriestSqlConfiguration.DATABASE_LOGIN_TIMEOUT,
				PriestSqlConfiguration.DATABASE_LOGIN_TIMEOUT_DEFAULT));
		List<Service> initedServices = new ArrayList<Service>();
		for (Service service : this.services) {
			try {
				service.init(conf);
				initedServices.add(service);
			} catch (Throwable root) {
				LOG.info(service.getName() + " initalization failed");
				stopServices(initedServices, service, root);
			}
		}
	}

	@Override
	protected void startService() {
		List<Service> startedServices = new ArrayList<Service>();
		for (Service service : this.services) {
			try {
				service.start();
				// Register MBean
				if (contextServer.jmxEnable && service instanceof JmxServer) {
					JmxServer.getInstance().registerMBean(contextServer,
							"priestsql:service=ContextServer,name=contextServer");
				}
				startedServices.add(service);
			} catch (Throwable root) {
				LOG.info(service.getName() + " starting failed", root);
				stopServices(startedServices, service, root);
			}
		}
	}

	private void stopServices(List<Service> services, Service service,
			Throwable root) {
		RuntimeException cause = root instanceof RuntimeException ? (RuntimeException) root
				: new RuntimeException(root);
		LOG.info("There are " + services.size() + " service will be stopped");
		try {
			for (Service initedService : services) {
				initedService.stop();
			}
		} catch (Throwable throwable) {
			cause.addSuppressed(throwable);
		}
		throw cause;
	}

	@Override
	protected void stopService() {
		RuntimeException cause = null;
		for (Service service : this.services) {
			try {
				service.stop();
			} catch (Throwable e) {
				if (cause == null) {
					cause = new RuntimeException(e);
				} else {
					cause.addSuppressed(e);
				}
			}
		}
		if (cause != null)
			throw cause;
	}

	private void addService(Service service) {
		this.services.add(service);
	}

	public static void main(String[] args) {
		Thread.setDefaultUncaughtExceptionHandler(new UncaughtExceptionHandler(){
			@Override
			public void uncaughtException(Thread t, Throwable e) {
				LOG.error(e.getMessage(), e);
			}
		});
		// Initialize log4j
		DOMConfigurator.configure(ContextServer.class.getClassLoader().getResource("log4j.xml"));
		// Instantiate configuration
		contextServer.conf = new PriestSqlConfiguration();
		//Set database login timeout
		DriverManager.setLoginTimeout(10);
		
		contextServer.jmxEnable = contextServer.conf.getBoolean(
				PriestSqlConfiguration.JMX_ENABLE,
				PriestSqlConfiguration.JMX_ENABLE_DEFAULT);
		contextServer.scheduleEnable = contextServer.conf.getBoolean(
				PriestSqlConfiguration.SCHEDULE_ENABLE,
				PriestSqlConfiguration.SCHEDULE_ENABLE_DEFAULT);
		if (contextServer.jmxEnable) {
			contextServer.addService(JmxServer.getInstance());
		}
		if (contextServer.scheduleEnable) {
			contextServer.addService(SchedulerServer.getInstance());
		}
		
		// Instantiate TaskServer
		contextServer.taskServer = new TaskServer();
		contextServer.addService(contextServer.taskServer);

		// Instantiate WebAppServer
		WebAppServer webAppServer = new WebAppServer();
		contextServer.addService(webAppServer);

		// Initialize all services
		contextServer.init(contextServer.conf);
		// Start all services
		contextServer.start();
	}
}