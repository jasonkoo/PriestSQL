package com.lenovo.priestsql.webserver;

import java.io.File;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.AllowSymLinkAliasChecker;
import org.eclipse.jetty.util.thread.ExecutorThreadPool;
import org.eclipse.jetty.util.thread.ScheduledExecutorScheduler;
import org.eclipse.jetty.util.thread.ThreadPool;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;

import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.service.AbstractService;

/**
 * Web applications server
 * @author luojiang2
 *
 */
public final class WebAppServer extends AbstractService {
	private static final Logger LOG = Logger.getLogger(WebAppServer.class);
	private Server webServer;
	private String bindAddress;
	private int httpPort;
	
	public WebAppServer() {
		super("WebAppServer");
	}

	@Override
	protected void initService() {
		webServer = new Server(getThreadPool());
		this.webServer.setStopAtShutdown(true);
		this.bindAddress = getHost();
		this.webServer.addBean(new ScheduledExecutorScheduler("priestsql.webapp.shared.scheduler",true),true);
		this.webServer.addConnector(getHttpConnector());
		this.webServer.setHandler(getWebAppContext());
	}
	
	private WebAppContext getWebAppContext() {
		WebAppContext webAppContext = new WebAppContext("priestsql.wabapp", "/");
		String webResourcesPath = System.getenv("WEB_RESOURCES_PATH");
		if(webResourcesPath == null){
			webResourcesPath = System.getProperty("WEB_RESOURCES_PATH");
			if(webResourcesPath == null){
				webResourcesPath = getConfig().get(PriestSqlConfiguration.WEBAPP_SERVER_WEB_RESOURCES_DIR,
						PriestSqlConfiguration.WEBAPP_SERVER_WEB_RESOURCES_DIR_DEFAULT);
			}
		}
		File warFile = new File(webResourcesPath);
		if(!warFile.exists()){
			throw new RuntimeException(warFile.getAbsolutePath() + " is not found.");
		}
		webAppContext.setWar(warFile.getAbsolutePath());
		webAppContext.addAliasCheck(new AllowSymLinkAliasChecker());
		// This webapp will use jsps and jstl. We need to enable the
        // AnnotationConfiguration in order to correctly
        // set up the jsp container
        Configuration.ClassList classlist = Configuration.ClassList.setServerDefault(this.webServer);
        classlist.addBefore(
                "org.eclipse.jetty.webapp.JettyWebXmlConfiguration",
                "org.eclipse.jetty.annotations.AnnotationConfiguration" );
        // Set the ContainerIncludeJarPattern so that jetty examines these
        // container-path jars for tlds, web-fragments etc.
        // If you omit the jar that contains the jstl .tlds, the jsp engine will
        // scan for them instead.
        webAppContext.setAttribute(
                "org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern",
                ".*/[^/]*servlet-api-[^/]*\\.jar$|.*/javax.servlet.jsp.jstl-.*\\.jar$|.*/[^/]*taglibs.*\\.jar$" );
		webAppContext.setParentLoaderPriority(true);
		return webAppContext;
	}

	private String getHost() {
		return getConfig().get(PriestSqlConfiguration.WEBAPP_SERVER_BIND_HOST, PriestSqlConfiguration.WEBAPP_SERVER_BIND_HOST_DEFAULT);
	}

	private Connector getHttpConnector() {
		this.httpPort = getConfig().getInt(PriestSqlConfiguration.WEBAPP_SERVER_BIND_HTTPPORT,
				PriestSqlConfiguration.WEBAPP_SERVER_BIND_HTTPPORT_DEFAULT);
		ServerConnector connector = new ServerConnector(this.webServer);
		connector.setName("HTTP_CONNECTOR");
		connector.setHost(this.bindAddress);
		connector.setPort(this.httpPort);
		return connector;
	}

	private ThreadPool getThreadPool() {
		int corePoolSize = getConfig().getInt(PriestSqlConfiguration.WEBAPP_SERVER_THREADPOOL_CORE_SIZE, 
				PriestSqlConfiguration.WEBAPP_SERVER_THREADPOOL_CORE_SIZE_DEFAULT);
		int maximumPoolSize = getConfig().getInt(PriestSqlConfiguration.WEBAPP_SERVER_THREADPOOL_MAX_SIZE, 
				PriestSqlConfiguration.WEBAPP_SERVER_THREADPOOL_MAX_SIZE_DEFAULT);
		BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<Runnable>();
		ThreadPoolExecutor executor = new ThreadPoolExecutor(corePoolSize, maximumPoolSize,Long.MAX_VALUE,
				TimeUnit.NANOSECONDS, workQueue,new HttpHandlerThreadFactory());
		return new ExecutorThreadPool(executor);
	}

	@Override
	protected void startService() {
		if(webServer != null){
			try {
				webServer.start();
				LOG.info(getName() + " is started.It binds at "+this.bindAddress+":"+this.httpPort);
				webServer.join();
			} catch (Exception e) {
				throw new RuntimeException("Failed to start web app server " + getName(),e);
			}
		}
	}

	@Override
	protected void stopService() {
		if(webServer != null){
			try {
				webServer.stop();
			} catch (Exception e) {
				throw new RuntimeException("Failed to stop web app server " + getName(),e);
			}
		}
	}
	
	class HttpHandlerThreadFactory implements ThreadFactory{
        private final ThreadGroup group;
        private final String namePrefix;
        HttpHandlerThreadFactory() {
            SecurityManager s = System.getSecurityManager();
            group = (s != null) ? s.getThreadGroup() :Thread.currentThread().getThreadGroup();
            namePrefix = "http-handler-thread-";
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