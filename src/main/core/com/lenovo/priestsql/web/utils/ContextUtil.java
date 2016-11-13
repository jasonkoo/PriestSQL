package com.lenovo.priestsql.web.utils;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

public class ContextUtil implements ApplicationListener<ApplicationEvent>{

	private static final Object lock = new Object();
	private static ApplicationContext context;
	
	public static ApplicationContext getContext(){
        return context;
    }

    @SuppressWarnings("unchecked")
	public static <T> T getBean(String beanName) {
    	waitApplicationContextAvailable();
        return (T) context.getBean(beanName);
    }

	public static <T> T getBean(String beanName,Class<T> clazz) {
		waitApplicationContextAvailable();
        return (T) context.getBean(beanName,clazz);
    }
	
	public static <T> T getBean(Class<T> clazz) {
		waitApplicationContextAvailable();
        return (T) context.getBean(clazz);
    }

	private static void waitApplicationContextAvailable() {
		if(context == null){
    		synchronized (lock) {
				while(context == null){
					try {
						lock.wait(1000);
					} catch (InterruptedException e) {}
				}
			}
    	}
	}
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		synchronized (lock) {
			if(event instanceof ContextRefreshedEvent){
				ContextRefreshedEvent crfe = (ContextRefreshedEvent)event;
				context = crfe.getApplicationContext();
				lock.notifyAll();
			}
		}
	}
}