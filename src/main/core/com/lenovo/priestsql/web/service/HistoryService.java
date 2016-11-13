package com.lenovo.priestsql.web.service;

import java.util.List;

import com.lenovo.priestsql.web.entity.FileHistory;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;

public interface HistoryService {

	/**
	 * 保存查询记录
	 * @param qh
	 * @return
	 */
	public int saveQueryHistory(QueryHistory qh);
	/**
	 * 更新查询的运行状态
	 * @param qh
	 * @return
	 */
	public int updateQueryHistory(QueryHistory qh);
	/**
	 * 获取最近24小时内对应应用的查询记录，默认返回十条
	 * @param param
	 * @return
	 */
	public List<QueryHistory> getQuertHistory(Param param);
	/**
	 * 获取指定查询的时间信息
	 * @param param
	 * @return
	 */
	public QueryHistory getQuertTime(Param param);
	/**
	 * 获取查询的执行状态
	 * @param param
	 * @return
	 */
	public int getQueryState(Param param);
	/**
	 * 获取文件操作日志
	 * @param param
	 * @return
	 */
	public FileHistory getFileHistory(Param param);
	/**
	 * 保存文件操作日志
	 * @param fh
	 * @return
	 */
	public int saveFileHistory(FileHistory fh);
}
