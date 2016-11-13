package com.lenovo.priestsql.web.utils;

import java.util.concurrent.locks.ReentrantLock;

import javax.sql.DataSource;

import org.apache.log4j.Logger;

import com.lenovo.leapid.common.LeapidDao;
import com.lenovo.leapid.common.LeapidService;

public class LeapidUtil {

	private static Logger logger=Logger.getLogger(LeapidUtil.class);
	private static LeapidService service;
	private static final ReentrantLock lock = new ReentrantLock();
	
	
	public static LeapidService getLeapidService(){
		lock.lock();
		try {
			if(service==null){
				DataSource leapid=ContextUtil.getBean("leapidDataSource");
				LeapidDao dao=new LeapidDao(leapid);
				service=new LeapidService(dao);
			}
		} catch (Exception e) {
			logger.error(e, e);
		}finally{
			lock.unlock();
		}
		return service;
	}
	
	
}
