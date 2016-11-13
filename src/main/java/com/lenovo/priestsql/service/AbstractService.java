package com.lenovo.priestsql.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.hadoop.conf.Configuration;
import org.apache.log4j.Logger;

import com.google.common.base.Preconditions;

/**
 * This is the base implementation class for <code>Service</code>
 * @author luojiang2
 */
public abstract class AbstractService implements Service {
	private static final Logger LOG = Logger.getLogger(AbstractService.class);
	private static final String WARN_MESS = "Service %s can't be initialized,its current state is %s";
	
	/**
	 * The service name
	 */
	private String name;
	/**
	 * It will be null until the service is initialized.
	 */
	private volatile Configuration conf;
	
	/**
	 * The service start time
	 */
	private long starttime;
	
	/**
	 * The service current state
	 */
	private STATE currentState = STATE.UNINITED;
	
	/**
	 * The service state transition lock.
	 */
	private final Object stateTransitionLock = new Object();
	
	/**
	 * Service name container for all service component
	 */
	private static final Map<String,Service> namesContainer = new HashMap<String,Service>();
	
	protected AbstractService(String name){
		Preconditions.checkArgument(name != null && !name.isEmpty(),"Service name must not be null or empty");
		synchronized (namesContainer) {
			if(namesContainer.containsKey(name)){
				String warnMess = name + "service is exists\n. The "+namesContainer.get(name).getClass()
						.getName() + " service is using '"+name+"\n',but '"+name+"' will be used by "+
						this.getClass().getName();
				LOG.warn(warnMess);
			}else{
				namesContainer.put(name, this);
			}
			this.name = name;
		}
	}
	
	@Override
	public void init(Configuration conf){
		Preconditions.checkNotNull(conf, "Can not initialize "+name+" service:null configuration");
		synchronized (stateTransitionLock) {
			if(currentState != STATE.UNINITED){
				throw new RuntimeException(String.format(WARN_MESS,getName(),currentState.getStatename()));
			}else{
				setConf(conf);
				currentState = STATE.INITED;
				initService();
			}
		}
	}

	@Override
	public void start() {
		synchronized (stateTransitionLock) {
			if(currentState != STATE.INITED){
				throw new RuntimeException(String.format(WARN_MESS,getName(),currentState.getStatename()));
			}else{
				this.currentState = STATE.STARTED;
				this.starttime = System.currentTimeMillis();
				startService();
			}
		}
	}

	@Override
	public void stop() {
		synchronized (stateTransitionLock) {
			if(this.currentState != STATE.STOPPED){
				this.currentState = STATE.STOPPED;
				stopService();
			}else{
				LOG.warn(name + " is in stopped state.");
			}
		}
	}

	@Override
	public String getName() {
		return this.name;
	}

	@Override
	public STATE getState() {
		return this.currentState;
	}

	@Override
	public long getStartTime() {
		return this.starttime;
	}

	@Override
	public Configuration getConfig() {
		return conf;
	}
	
	protected void setConf(Configuration conf){
		if(this.conf != null && this.conf != conf){
			LOG.info("Configuration has been overridden for " + getName());
		}
		this.conf = conf;
	}
	
	/**
	 * Initialize service,subclass must be implement this method.
	 */
	protected abstract void initService();
	
	/**
	 * Start service,subclass must be implement this method.
	 */
	protected abstract void startService();
	
	/**
	 * Stop service,subclass must be implement this method.
	 */
	protected abstract void stopService();
}