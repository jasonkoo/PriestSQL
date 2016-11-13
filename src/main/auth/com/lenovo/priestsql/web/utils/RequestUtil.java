package com.lenovo.priestsql.web.utils;

import javax.servlet.http.HttpServletRequest;

public class RequestUtil {

	
	public static boolean checkPermission(HttpServletRequest request){
		String url=request.getRequestURI();
		if(url.endsWith("login")||url.endsWith("register") || url.endsWith("noPermisson.jsp")|| url.endsWith("login.jsp") || url.contains("/images/") || url.contains("logout")|| url.contains("/css/")|| url.contains("/js/")|| url.contains("/document/") ){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 是否为ajax请求
	 */
	public static boolean isAjaxRequest(HttpServletRequest request) {
		return "XMLHttpRequest".equalsIgnoreCase(request.getHeader("x-requested-with"));
	}
}
