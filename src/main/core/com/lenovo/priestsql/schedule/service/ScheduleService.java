package com.lenovo.priestsql.schedule.service;

import org.apache.hadoop.hive.ql.parse.ParseException;
import org.quartz.SchedulerException;

import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.web.entity.Page;

import java.util.Map;

/**
 * Query schedule service
 * 
 */
public interface ScheduleService {
	
	/**
	 * Add query job
	 * @param jobEntity
	 * @exception ParseException,SchedulerException
	 */
	void addJob(QueryEntity jobEntity) throws ParseException,SchedulerException;
	
	/**
	 * Delete query job
	 * @param id
	 * @param stopExecute
	 */
	void deleteJob(int id, boolean stopExecute);
	
	/**
	 * Update query job
	 * @param jobEntity
	 * @param stopExecute
	 */
	void updateJob(QueryEntity jobEntity,boolean stopExecute);

	/**
	 * Update query entity.
	 * @param queryEntity
	 */
	void updateQueryEntity(QueryEntity queryEntity);

	/**
	 * Obtain query jobs
	 * @param owner
	 * @param page
	 * @param pageSize
	 * @param latest
	 * @param filters
	 * @return
	 */
	Page<QueryEntity> queryJobs(String owner, int page, int pageSize, boolean latest, Map<String, Object> filters);

	/**
	 * Obtain query job count
	 * @param owner
	 * @param latest
	 * @return
	 */
	int queryJobsCount(String owner,boolean latest);
	
	/**
	 * Stop query job
	 *
	 * @param executionId@return
	 */
	boolean stopJob(int executionId, int jobId);
	
	/**
	 * Rerun query job
	 * @param id
	 */
	void reRunJob(int id);

	/**
	 * Obatain QueryEntity by id
	 * @param id
	 * @return
	 */
	QueryEntity getQueryEntity(int id);

	/**
	 * Obtain QueryEntity by name
	 * @param name
	 * @return
	 */
	QueryEntity getQueryEntityByName(String owner, String name);

	/**
	 * Update query execution log
	 * @param qee
	 */
	void updateQueryExecutionRecord(QueryExecutionEntity qee);

	/**
	 * Add query execution record
	 * @param qee
	 */
	void addQueryExecutionRecord(QueryExecutionEntity qee);

	/**
	 * Find query execution records.
	 * @param owner
	 * @param currentPage
	 * @param pageSize
	 * @param filters
	 * @return QueryExecutionEntity
	 */
	Page<QueryExecutionEntity> findQueryExecutionEntityList(String owner, int currentPage, int pageSize, Map<String, Object> filters);

	/**
	 * View query execution records.
	 * @param owner
	 * @param currentPage
	 * @param pageSize
	 * @return QueryExecutionEntity
	 */
	Page<QueryExecutionEntity> getQueryExecutionEntityByQueryId(String owner, int currentPage, int pageSize, int queryId);

	/**
	 * Disable the job.
	 * @param id
	 */
	void disableJob(int id);

	/**
	 * Enable the job.
	 * @param id
	 */
	void enableJob(int id);
}