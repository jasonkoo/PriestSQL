package com.lenovo.priestsql.web.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.lenovo.priestsql.web.dao.mapper.FileHistoryMapper;
import com.lenovo.priestsql.web.dao.mapper.QueryHistoryMapper;
import com.lenovo.priestsql.web.entity.FileHistory;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;
@Repository
public class HistoryDao  {
	
	@Autowired
	private QueryHistoryMapper qhm;
	@Autowired
	private FileHistoryMapper fhm;
	
	public int saveQueryHistory(QueryHistory qh){
		return qhm.saveQueryHistory(qh);
	}
	
	public int updateQueryHistory(QueryHistory qh){
		return qhm.updateQueryHistory(qh);
	}
	
	public List<QueryHistory> getQuertHistory(Param param){
		return qhm.getQuertHistory(param);
	}
	
	public QueryHistory getQuertTime(Param param){
		return qhm.getQuertTime(param);
	}
	
	public int getQueryState(Param param){
		return qhm.getQueryState(param);
	}
	
	public FileHistory getFileHistory(Param param){
		return fhm.getFileHistory(param);
	}
	
	public int saveFileHistory(FileHistory fh){
		return fhm.saveFileHistory(fh);
	}
	
}
