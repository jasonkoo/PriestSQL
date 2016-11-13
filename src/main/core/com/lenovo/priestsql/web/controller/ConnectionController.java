package com.lenovo.priestsql.web.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.ResponseCode;


@RestController
@RequestMapping("connect")
public class ConnectionController {
	
	Logger logger =Logger.getLogger(ConnectionController.class);
	
	@Autowired
	private ConnectionService cs;
	
	
	@RequestMapping("saveConnection")
	public Object saveConnection(HttpSession session,CustomConnection cc){
		try {
			if("all".equalsIgnoreCase(cc.getConnectOwner())){
				cc.setConnectOwner("*");
			}else{
				cc.setConnectOwner((String) session.getAttribute("username"));
			}
			return new JsonResult(cs.saveConnection(cc)?ResponseCode.SUCCESS:ResponseCode.FAIL,null);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL,e.getMessage());
		}
	}
	
	@RequestMapping("getConnections")
	public Object getConnections(HttpSession session){
		try {
			return new JsonResult(cs.getConnections((String) session.getAttribute("username")));
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL,e.getMessage());
		}
	}
	
	@RequestMapping("delConnection")
	public Object delConnection(int id){
		try {
			return new JsonResult(cs.delConnection(id)?ResponseCode.SUCCESS:ResponseCode.FAIL,null);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL,e.getMessage());
		}
	}
	
	@RequestMapping("checkConnection")
	public Object checkConnection(CustomConnection cc){
		Connection conn=null;
		try {
			Class.forName(cc.getConnectDriver());
			String url=cc.getConnectUrl();
			conn = DriverManager.getConnection(url,cc.getConnectUser(),cc.getConnectPwd());
			return new JsonResult(ResponseCode.SUCCESS,null);
		} catch (Exception e) {
			return new JsonResult(ResponseCode.FAIL,e.getMessage());
		}finally{
			if(conn!=null){
				try {
					conn.close();
				} catch (SQLException e) {
				}
			}
		}
		
		
	}
}
