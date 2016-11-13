package com.lenovo.priestsql.web.task;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;

import com.lenovo.priestsql.web.dao.mapper.CustomConnectionMapper;
import com.lenovo.priestsql.web.dao.mapper.QueryHistoryMapper;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.entity.QueryHistory;
import com.lenovo.priestsql.web.utils.ConnUtil;
import com.lenovo.priestsql.web.utils.ContextUtil;


public class TmpTableCleanerTask {

	Logger logger= Logger.getLogger(TmpTableCleanerTask.class);
	
	private CustomConnectionMapper customConnectionMapper;
	
	private QueryHistoryMapper queryHistoryMapper;
	
	
	/**
	 * 每小时执行任务
	 */
	@Scheduled(fixedDelay=60*1000*60)
	public void cleanTmpTable(){
		customConnectionMapper=ContextUtil.getBean("customConnectionMapper");
		queryHistoryMapper=ContextUtil.getBean("queryHistoryMapper");
		
		List<QueryHistory> qhs=queryHistoryMapper.getQuertHistoryForCleanTask();
		
		for (QueryHistory queryHistory : qhs) {
			Statement stmt=null;
			Connection conn=null;
			try {
				CustomConnection cc=customConnectionMapper.getConnection(queryHistory.getConnId());
				conn=ConnUtil.getConnection(cc, queryHistory.getProxyUser());
				stmt = conn.createStatement();
				String sql="DROP TABLE IF EXISTS "+queryHistory.getTmpTable();
				stmt.execute(sql);
				queryHistory.setTmpTable(null);
				queryHistoryMapper.updateQueryHistoryAfterClean(queryHistory);
			} catch (Exception e) {
				logger.error(e, e);
			} finally{
				if(stmt!=null){
					try {
						stmt.close();
					} catch (SQLException e) {
						logger.error(e, e);
					}
				}
				if(conn!=null){
					try {
						conn.close();
					} catch (SQLException e) {
						logger.error(e, e);
					}
				}
			}
		}
		
	}
}
