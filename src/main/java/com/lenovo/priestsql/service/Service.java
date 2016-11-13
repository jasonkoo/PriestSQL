package com.lenovo.priestsql.service;

import org.apache.hadoop.conf.Configuration;

/**
 * Service lifeCycle
 * @author luojiang2
 */
public interface Service{
	public enum STATE{
		/** The service is constructed but not initialized*/
		UNINITED(0,"uninited"),
		/** The service is initialized*/
		INITED(1,"inited"),
		/** The service is started*/
		STARTED(2,"started"),
		/** The service is stopped*/
		STOPPED(3,"stopped");
		
		private final int statecode;
		private final String statename;
		
		private STATE(int statecode,String statename){
			this.statecode = statecode;
			this.statename = statename;
		}
		public int getStatecode() {
			return statecode;
		}
		public String getStatename() {
			return statename;
		}
	}
	
	/**
	 * Initialize the service.
	 * The state transition of service must be {@link STATE#NOTINITED} to {@link STATE#INITED}
	 * unless the state transition failed or an exception was raised,in which case the
	 * {@link STATE#STOPPED} must be invoked and the service enter the {@link STATE#STOPPED} state.
	 * 
	 * @param conf The configuration of the service
	 * @throws RuntimeException on any failure during the operation
	 */
	void init(Configuration conf);
	
	/**
	 * Start the service.
	 * The state transition of service must be {@link STATE#INITED} to {@link STATE#STARTED}
	 * unless the state transition failed or an exception was raised,in which case the
	 * {@link STATE#STOPPED} must be invoked and the service enter the {@link STATE#STOPPED} state
	 * 
	 * @throws RuntimeException on any failure during the operation
	 */
	void start();
	
	/**
	 * Stop the service.
	 * This must be a no-op if the is already in the {@link STATE#STOPPED} state.It should be
	 * a best-effort attempt to stop all parts of the service.
	 * 
	 * The implementation must be designed to complete regardless of the service state,
	 * including the {@link STATE#NOTINITED}/{@link STATE#INITED} state of all its internal fields.
	 * 
	 * @throws RuntimeException on any failure during the operation
	 */
	void stop();
	
	/**
	 * Get the name of the service
	 * @return
	 */
	String getName();
	
	/**
	 * Get the <code>STATE</code> of the service
	 * @return
	 */
	STATE getState();
	
	/**
	 * Get the service start time
	 * @return
	 */
	long getStartTime();
	
	/**
	 * Get the service configuration
	 * @return
	 */
	Configuration getConfig();
}