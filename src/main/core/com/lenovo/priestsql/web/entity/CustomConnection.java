package com.lenovo.priestsql.web.entity;

import com.lenovo.priestsql.web.utils.ConnectionType;

/**
 * 自定义连接
 * @author zhouyu16
 *
 */
public class CustomConnection {

	/**
	 * id
	 */
	private int id;
	/**
	 * 连接名称
	 */
	private String connectName;
	/**
	 * 连接类型，mysql,impala,hive,spark,postgresql
	 */
	private ConnectionType connectType;
	/**
	 * 连接地址
	 */
	private String connectUrl;
	/**
	 * 连接驱动
	 */
	private String connectDriver;
	/**
	 * 连接用户名
	 */
	private String connectUser;
	/**
	 * 连接密码
	 */
	private String connectPwd;
	/**
	 * 连接所有人
	 */
	private String connectOwner;
	
	public CustomConnection(){
		
	}

	public CustomConnection( String connectName, ConnectionType connectType,
			String connectUrl, String connectDriver, String connectUser,
			String connectPwd,String connectOwner) {
		this.connectName = connectName;
		this.connectType = connectType;
		this.connectUrl = connectUrl;
		this.connectDriver = connectDriver;
		this.connectUser = connectUser;
		this.connectPwd = connectPwd;
		this.connectOwner = connectOwner;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getConnectName() {
		return connectName;
	}

	public void setConnectName(String connectName) {
		this.connectName = connectName;
	}

	public String getConnectType() {
		return connectType.getName();
	}
	
	public ConnectionType getConnectTypeEnum(){
		return this.connectType;
	}

	public void setConnectType(String connectType) {
		if("mysql".equalsIgnoreCase(connectType)){
			this.connectType = ConnectionType.MYSQL;
			this.connectDriver="com.mysql.jdbc.Driver";
		}else if("impala".equalsIgnoreCase(connectType)){
			this.connectType = ConnectionType.IMPALA;
			this.connectDriver="org.apache.hive.jdbc.HiveDriver";
		}else if("hive".equalsIgnoreCase(connectType)){
			this.connectType = ConnectionType.HIVE;
			this.connectDriver="org.apache.hive.jdbc.HiveDriver";
		}else if("spark".equalsIgnoreCase(connectType)){
			this.connectType = ConnectionType.SPARK;
			this.connectDriver="org.apache.hive.jdbc.HiveDriver";
		}else if("postgresql".equalsIgnoreCase(connectType)){
			this.connectType = ConnectionType.POSTGRESQL;
			this.connectDriver="org.postgresql.Driver";
		}else{
			this.connectType = ConnectionType.HIVE;
			this.connectDriver="org.apache.hive.jdbc.HiveDriver";
		}
	}

	public String getConnectUrl() {
		return connectUrl;
	}

	public void setConnectUrl(String connectUrl) {
		this.connectUrl = connectUrl;
	}

	public String getConnectDriver() {
		return connectDriver;
	}

	public void setConnectDriver(String connectDriver) {
		this.connectDriver = connectDriver;
	}

	public String getConnectUser() {
		return connectUser;
	}

	public void setConnectUser(String connectUser) {
		this.connectUser = connectUser;
	}

	public String getConnectPwd() {
		return connectPwd;
	}

	public void setConnectPwd(String connectPwd) {
		this.connectPwd = connectPwd;
	}

	public String getConnectOwner() {
		return connectOwner;
	}

	public void setConnectOwner(String connectOwner) {
		this.connectOwner = connectOwner;
	}

	
	
}
