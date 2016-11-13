package com.lenovo.priestsql.web.entity;

import java.util.Date;

public class FileHistory {

	/**
	 * 日志id
	 */
	private int id;
	/**
	 * 操作人id
	 */
	private String loginName;
	/**
	 * 操作目标路径
	 */
	private String targetPath;
	/**
	 * 操作类型 
	 */
	private operatTypeEnum operatType;
	/**
	 * 操作结果 1：成功，0：失败
	 */
	private int result;
	/**
	 * 代理用户
	 */
	private String proxyUser;
	/**
	 * 日期
	 */
	private Date date;
	
	public FileHistory(){
		
	}
	
	public FileHistory(Param param,operatTypeEnum operatType){
		this.loginName=param.getLoginName();
		this.targetPath=param.getNewPath()==null?param.getPath():param.getPath()+" -> "+param.getNewPath();
		this.operatType=operatType;
		this.proxyUser = param.getProxyUserName();
	}
	
	public FileHistory(int id, String lenovoId, String targetPath,
			operatTypeEnum operatType, int result,String proxyUser, Date date) {
		this.id = id;
		this.loginName = lenovoId;
		this.targetPath = targetPath;
		this.operatType = operatType;
		this.result=result;
		this.proxyUser = proxyUser;
		this.date = date;
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
	public String getTargetPath() {
		return targetPath;
	}
	public void setTargetPath(String targetPath) {
		this.targetPath = targetPath;
	}
	public int getOperatType() {
		return operatType.getValue();
	}
	public void setOperatType(operatTypeEnum operatType) {
		this.operatType = operatType;
	}
	
	public void setOperatType(int operatType) {
		this.operatType = operatTypeEnum.getEnumByValue(operatType);
	}
	
	public String getProxyUser() {
		return proxyUser;
	}
	public void setProxyUser(String proxyUser) {
		this.proxyUser = proxyUser;
	}
	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	
	/**
	 * 操作类型 0：增加文件夹，1：增加文件，2：删除文件，3：删除文件夹，4：重命名文件，5：移动文件，6：查看文件，7：下载文件
	 */
	public enum operatTypeEnum {
		ADD_FILE(0),ADD_PATH(1),DEL_FILE(2),DEL_PATH(3),RENAME_FILE_OR_PATH(4),MOVE_FILE(5),READ_FILE(6),DOWNLOAD_FILE(7),UNCOMPRESS_FILE(8),COPY_FILE(9);

		private int value;

		private operatTypeEnum(int value) {
			this.value = value;
		}

		public int getValue() {
			return value;
		}

		public static operatTypeEnum getEnumByValue(int value){
			switch (value) {
			case 0:
				return ADD_FILE;
			case 1:
				return ADD_PATH;
			case 2:
				return DEL_FILE;
			case 3:
				return DEL_PATH;
			case 4:
				return RENAME_FILE_OR_PATH;
			case 5:
				return MOVE_FILE;
			case 6:
				return READ_FILE;
			case 7:
				return DOWNLOAD_FILE;
			case 8:
				return UNCOMPRESS_FILE;
			case 9:
				return COPY_FILE;
			default:
				return null;
			}
		}
	}
	
}
