package com.lenovo.priestsql.web.entity;

/**
 * 用户的自定义的左侧列表对新
 * @author zhouyu16
 *
 */
public class CustomEntry {

	/**
	 * 登录名
	 */
	private String loginName;
	/**
	 * 条目的id
	 */
	private int id;
	/**
	 * 别名
	 */
	private String alias;
	/**
	 * 条目内容
	 */
	private String context;
	/**
	 * 下级条目的数量
	 */
	private int sonCount;
	/**
	 * 连接id
	 */
	private int connId;
	
	public CustomEntry(){
		
	}
	
	public CustomEntry(String loginName,  String alias, String context,int connId) {
		this.loginName = loginName;
		this.alias = alias;
		this.context = context;
		this.connId=connId;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getContext() {
		return context;
	}
	public void setContext(String context) {
		this.context = context;
	}

	public int getSonCount() {
		return sonCount;
	}

	public void setSonCount(int sonCount) {
		this.sonCount = sonCount;
	}

	public int getConnId() {
		return connId;
	}

	public void setConnId(int connId) {
		this.connId = connId;
	}
}
