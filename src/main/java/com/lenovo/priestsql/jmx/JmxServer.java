package com.lenovo.priestsql.jmx;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.util.Hashtable;
import java.util.Map;

import javax.management.InstanceAlreadyExistsException;
import javax.management.MBeanRegistrationException;
import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.NotCompliantMBeanException;
import javax.management.ObjectName;

import mx4j.tools.adaptor.http.XSLTProcessor;

import org.apache.log4j.Logger;

import com.google.common.base.Preconditions;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.service.AbstractService;

/**
 * Jmx Server
 * @author luojiang2
 */
public class JmxServer extends AbstractService {
	private static final Logger LOG = Logger.getLogger(JmxServer.class);
	private static final JmxServer jmxServer = new JmxServer();
	private final MBeanServer mbeanServer = ManagementFactory.getPlatformMBeanServer();
	private HttpAdaptor httpAdaptor;
	private String jmxHost;
	private int jmxPort;
	
	private JmxServer() {
		super("JmxServer");
	}
	
	public static JmxServer getInstance(){
		return jmxServer;
	}
	
	@Override
	protected void initService() {
		jmxHost = getConfig().get(PriestSqlConfiguration.JMX_AGENT_BIND_HOST,
				PriestSqlConfiguration.JMX_AGENT_BIND_HOST_DEFAULT);
		jmxPort = getConfig().getInt(PriestSqlConfiguration.JMX_AGENT_BIND_PORT,
				PriestSqlConfiguration.JMX_AGENT_BIND_PORT_DEFAULT);
		String username = getConfig().get(PriestSqlConfiguration.JMX_HTTPADAPTOR_USERNAME,
				PriestSqlConfiguration.JMX_HTTPADAPTOR_USERNAME_DEFAULT);
		String password = getConfig().get(PriestSqlConfiguration.JMX_HTTPADAPTOR_PASSWORD,
				PriestSqlConfiguration.JMX_HTTPADAPTOR_PASSWORD_DEFAULT);
		String authMethod = getConfig().get(PriestSqlConfiguration.JMX_HTTPADAPTOR_AUTH_METHOD,
				PriestSqlConfiguration.JMX_HTTPADAPTOR_AUTH_METHOD_DEFAULT);
		this.httpAdaptor = new HttpAdaptor(jmxPort,jmxHost);
		httpAdaptor.addAuthorization(username, password);
		httpAdaptor.setAuthenticationMethod(authMethod);
		this.httpAdaptor.setProcessor(new XSLTProcessor());
	}

	@Override
	protected void startService() {
		try {
			this.registerMBean(httpAdaptor,"priestsql:jmxAgent=httpAdaptor,host="+jmxHost+",port="+jmxPort);
			this.httpAdaptor.start();
			LOG.info(getName()+" is started.HttpAdaptor started on "+jmxHost +":" + jmxPort);
		} catch (IOException e) {
			throw new RuntimeException("Failed to start JmxServer",e);
		}
	}

	@Override
	protected void stopService() {
		this.httpAdaptor.stop();
		LOG.info(getName()+" is stopped.HttpAdaptor stopped on port " + this.jmxPort);
	}
	
	/**
	 * Register mbean
	 * @param object
	 * @param name
	 */
	public void registerMBean(Object object,String name){
		checkState();
		try {
			this.registerMBean(object, new ObjectName(name));
		} catch (MalformedObjectNameException | NullPointerException e) {
			throw new RuntimeException(e);
		}
	}
	/**
	 * Register mbean
	 * @param object
	 * @param name
	 */
	public void registerMBean(Object object,ObjectName name){
		checkState();
		try {
			this.mbeanServer.registerMBean(object, name);
		} catch (InstanceAlreadyExistsException | MBeanRegistrationException
				| NotCompliantMBeanException e) {
			@SuppressWarnings("unchecked")
			Hashtable<String,String> kv = name.getKeyPropertyList();
			StringBuilder sb = new StringBuilder(name.getDomain()).append(":");
			kv.forEach((k,v) -> sb.append(k).append("=").append(v).append(","));
			throw new RuntimeException("Failed to register mbean:"+sb.deleteCharAt(sb.length() - 1),e);
		}
	}
	/**
	 * Register mbean
	 * @param object
	 * @param domain
	 * @param kvPairs
	 */
	public void registerMBean(Object object,String domain,Map<String,String> kvPairs){
		checkState();
		Preconditions.checkNotNull(object,"Can't register mbean.The mbean object is null");
		StringBuilder sb = new StringBuilder();
		if(domain == null || domain.trim().isEmpty()){
			sb.append(domain.trim());
		}else{
			sb.append("priestsql");
		}
		sb.append(":");
		if(kvPairs == null || kvPairs.size() == 0){
			sb.append("name=").append(object.getClass().getName());
		}else{
			kvPairs.forEach((k,v) -> sb.append(k).append("=").append(v).append(","));
		}
		try {
			this.registerMBean(object,new ObjectName(sb.substring(0,sb.length() -1)));
		} catch (MalformedObjectNameException e) {
			throw new RuntimeException(e);
		}
	}

	private void checkState() {
		if(getState() != STATE.STARTED){
			throw new RuntimeException(getName()+" state is " + getState().getStatename()+
					".Can't register MBean");
		}
	}
}