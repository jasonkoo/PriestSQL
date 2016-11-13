package com.lenovo.priestsql.web.dao.mapper;

import java.util.List;

import com.lenovo.priestsql.web.entity.CustomConnection;

public interface CustomConnectionMapper extends Mapper<CustomConnection>{

	/**
	 * 保存连接
	 * @param cp
	 * @return
	 */
	public int saveConnection(CustomConnection cp);
	/**
	 * 更新连接
	 * @param cp
	 * @return
	 */
	public int updateConnection(CustomConnection cp);
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
	public int delConnection(int id);
}
