package com.lenovo.priestsql.web.entity;

public class ClusterUser {

	/**
	 * 集群用户
	 */
	private String userName;
	
	
	public ClusterUser(){
		
	}

	public ClusterUser(String userName) {
		this.userName = userName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	
	
}
