package com.lenovo.priestsql.web.service;

import java.util.List;
import java.util.Map;

import com.lenovo.priestsql.web.entity.Column;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.entity.Param;

public interface ConnectionService {

	/**
	 * 更新连接
	 * @param cc
	 * @return
	 */
	public boolean saveConnection(CustomConnection cc);
	/**
	 * 更新连接
	 * @param cc
	 * @return
	 */
	public boolean updateConnection(CustomConnection cc);
	/**
	 * 根据联想账号获取自定义连接
	 * @param lenovoid
	 * @return
	 */
	public List<CustomConnection> getConnections(String lenovoid);
	/**
	 * 根据连接id获取连接
	 * @param id
	 * @return
	 */
	public CustomConnection getConnection(int id);
	/**
	 * 根据连接id获取连接,即使是已标记为删除的同样可获取
	 * @param id
	 * @return
	 */
	public CustomConnection getConnectionForCleanTask(int id);
	/**
	 * 根据id删除连接
	 * @param id
	 * @return
	 */
	public boolean delConnection(int id);
	
	/**
	 * 搜索库，以及库下面的表
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Map<Object,Object> searchDAT(Param param) throws Exception;
	
	/**
	 * 根据连接获取库名
	 * @param cc
	 * @return
	 * @throws Exception 
	 */
	public List<String> getDatabase(CustomConnection cc) throws Exception;
	
	/**
	 * 获取表信息
	 * @param DbName 数据库
	 * @param tblName 表名的过滤字段
	 * @param cc 自定义连接
	 * @return
	 * @throws Exception
	 */
	public List<String> getTables(String DbName,String tblName,CustomConnection c) throws Exception;
	
	/**
	 * 获取字段信息
	 * @param DbName 数据库
	 * @param tblName 表名
	 * @param cc 自定义连接
	 * @return
	 * @throws Exception
	 */
	public List<Column> getColumn(String DbName,String tblName,CustomConnection cc) throws Exception;
}
