package com.lenovo.priestsql;

public interface ContextServerMBean {
	boolean getForbidSubmitTask();
	void setForbidSubmitTask(boolean forbidSubmitTask);
	
	String getForbidSubmitTaskReasonEn();
	void setForbidSubmitTaskReasonEn(String forbidSubmitTaskReasonEn);
	
	String getForbidSubmitTaskReasonZh();
	void setForbidSubmitTaskReasonZh(String forbidSubmitTaskReasonZh);
	
	//Update configuration property
	void updateProperty(String name,String value);
}