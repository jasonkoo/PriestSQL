package com.lenovo.priestsql.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovo.priestsql.web.dao.HistoryDao;
import com.lenovo.priestsql.web.dao.dataSource.DataSourceContextHolder;
import com.lenovo.priestsql.web.entity.FileHistory;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;
import com.lenovo.priestsql.web.service.HistoryService;
@Service
public class HistoryServiceImpl implements HistoryService{

	@Autowired
	private HistoryDao hd;
	
	public int saveQueryHistory(QueryHistory qh){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.saveQueryHistory(qh);
	}
	
	public int updateQueryHistory(QueryHistory qh){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.updateQueryHistory(qh);
	}
	
	public List<QueryHistory> getQuertHistory(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.getQuertHistory(param);
	}
	
	public QueryHistory getQuertTime(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.getQuertTime(param);
	}
	
	public int getQueryState(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.getQueryState(param);
	}
	
	public FileHistory getFileHistory(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.getFileHistory(param);
	}
	
	public int saveFileHistory(FileHistory fh){
		DataSourceContextHolder.setDataSourceType("main");
		return hd.saveFileHistory(fh);
	}

	
}
