package com.lenovo.priestsql.web.utils;

public class ResponseCode {

	// 成功
	public static final int SUCCESS = 1;
	// 失败
	public static final int FAIL = 0;
	// 未登录
	public static final int NO_LOGIN = -1;
	// 没有权限
	public static final int NO_PRIVILEGE = -2;
	// 非法字符
	public static final int ILLEGAL_CHARS = -3;
	// 非法参数
	public static final int ILLEGAL_PARAMS = -5;
	//重复添加，请确认后添加
	public static final int DUPLICATEKEY = -7;
	//结束
	public static final int FINISHED = 2;
	//过期
	public static final int EXPIRED=3;
}