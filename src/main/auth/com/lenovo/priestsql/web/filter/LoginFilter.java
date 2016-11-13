package com.lenovo.priestsql.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.utils.RequestUtil;



/**
 * 
 * @author yuehan1
 * @date 2015年4月22日
 */
public class LoginFilter implements Filter{
	
	Logger logger= Logger.getLogger(LoginFilter.class);
	
	public void doFilter(ServletRequest req,ServletResponse res, FilterChain chain) throws IOException,ServletException {
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;
		if(RequestUtil.checkPermission(request)){
			try {
				if(request.getSession().getAttribute("lang")==null){
					String language=ContextServer
							.getInstance()
							.getConfig()
							.get(PriestSqlConfiguration.LANGUAGE,
									PriestSqlConfiguration.LANGUAGE_DEFAULT);
					request.getSession().setAttribute("lang", language);
				}
			} catch (Exception e) {
				logger.error(e, e);
			}
			
			chain.doFilter(request, response);
		}else{
			try {
				String loginName = (String) request.getSession().getAttribute("username");
				if(loginName==null){
					if(RequestUtil.isAjaxRequest(request)){
						response.setContentType("application/json;charset=utf-8");
						response.getWriter().write("{\"code\":-1}");
					}else{
						 request.getRequestDispatcher("/login.jsp").forward(request, response);
					}
				}else{
				      	chain.doFilter(request, response); 
				}
			} catch (Exception e) {
				logger.error(e,e);
			}
		}
	}

	public void destroy() {
		
	}

	public void init(FilterConfig arg0) throws ServletException {
		
	}

	
}