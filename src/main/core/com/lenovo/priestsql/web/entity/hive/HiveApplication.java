package com.lenovo.priestsql.web.entity.hive;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.yarn.api.records.ApplicationId;
import org.apache.hadoop.yarn.api.records.ApplicationReport;
import org.apache.hadoop.yarn.api.records.YarnApplicationState;

public class HiveApplication {

	private String appId;
	
	private ApplicationId applicationId;

	private String name;

	private YarnApplicationState  state;
	
	private String proxyUserName;

	private String queue;
	
	private String applicationType;
	
	private Date submitTime;
	
	private Date finishiTime;
	
	private boolean terminable;
	
	private float process;
	
	public HiveApplication(){
		
	}
	
	public HiveApplication(String pUN,ApplicationReport ar){
		this.appId=ar.getApplicationId().toString();
		this.name=ar.getName();
		this.state=ar.getYarnApplicationState();
		this.proxyUserName=ar.getUser();
		this.queue=ar.getQueue();
		this.applicationType=ar.getApplicationType();
		this.submitTime=new Date(ar.getStartTime());
		this.terminable=pUN.equals(ar.getUser())&&ar.getYarnApplicationState()==YarnApplicationState.RUNNING;
		this.process=ar.getProgress();
		this.finishiTime=new Date(ar.getFinishTime());
	}
	
	
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
		if(StringUtils.isNotBlank(appId)){
			this.applicationId=formateStringToApplicationId(appId);
		}
	}

	public ApplicationId getApplicationId() {
		return applicationId;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public YarnApplicationState getState() {
		return state;
	}

	public void setState(YarnApplicationState state) {
		this.state = state;
	}

	public String getProxyUserName() {
		return proxyUserName;
	}

	public void setProxyUserName(String proxyUserName) {
		this.proxyUserName = proxyUserName;
	}

	public String getQueue() {
		return queue;
	}

	public void setQueue(String queue) {
		this.queue = queue;
	}

	public String getApplicationType() {
		return applicationType;
	}

	public void setApplicationType(String applicationType) {
		this.applicationType = applicationType;
	}

	public Date getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(Date submitTime) {
		this.submitTime = submitTime;
	}

	public Date getFinishiTime() {
		return finishiTime;
	}

	public void setFinishiTime(Date finishiTime) {
		this.finishiTime = finishiTime;
	}

	public boolean isTerminable() {
		return terminable;
	}

	public void setTerminable(boolean terminable) {
		this.terminable = terminable;
	}

	public float getProcess() {
		return process;
	}

	public void setProcess(float process) {
		this.process = process;
	}

	public void setApplicationId(ApplicationId applicationId) {
		this.applicationId = applicationId;
	}

	private ApplicationId formateStringToApplicationId(String appid){
		String[] strs=appid.split("_");
		return ApplicationId.newInstance(Long.parseLong(strs[1]), Integer.parseInt(strs[2]));
	}
}
