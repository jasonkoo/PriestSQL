package com.lenovo.priestsql.schedule.dao;

import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.web.dao.mapper.Mapper;

import java.util.List;
import java.util.Map;

public interface ScheduleDao<T> extends Mapper<T>{

	int addJob(QueryEntity queryEntity);

	int deleteJob(int id);

	QueryEntity getQueryEntity(int id);

	int updateJob(QueryEntity queryEntity);

	QueryEntity getQueryEntityByCondition(Map<String, Object> parameters);

	List<QueryEntity> findQueryEntityList(Map<String, Object> parameters);

	int countQueryEntity(Map<String, Object> parameters);



	void updateQueryExecutionRecord(QueryExecutionEntity qee);

	void addQueryExecutionRecord(QueryExecutionEntity qee);

	List<QueryExecutionEntity> findQueryJobExecutionList(Map<String, Object> parameters);

	int countQueryExecutionRecord(Map<String, Object> parameters);

	int deleteQueryExecutionRecord(int jobId);

	QueryExecutionEntity getQueryExecutionRecord(int id);
}
