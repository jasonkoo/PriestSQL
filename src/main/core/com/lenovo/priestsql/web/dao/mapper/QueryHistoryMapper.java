package com.lenovo.priestsql.web.dao.mapper;

import java.util.List;

import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;

@SuppressWarnings("rawtypes")
public interface QueryHistoryMapper  extends Mapper{

	int saveQueryHistory(QueryHistory qh);
	
	List<QueryHistory> getQuertHistory(Param param);
	
	List<QueryHistory> getQuertHistoryForCleanTask();
	
	int updateQueryHistory(QueryHistory qh);
	
	int updateQueryHistoryAfterClean(QueryHistory qh);
	
	int getQueryState(Param param);
	
	QueryHistory getQuertTime(Param param);
}
