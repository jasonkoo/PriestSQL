package com.lenovo.priestsql.schedule.service;

import java.io.IOException;
import java.util.*;

import com.lenovo.priestsql.i18n.MessageKey;
import com.lenovo.priestsql.web.exception.*;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hive.ql.parse.ParseException;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.hql.HQL;
import com.lenovo.priestsql.hql.HQLParseResult;
import com.lenovo.priestsql.hql.HQLParser;
import com.lenovo.priestsql.hql.OperationType;
import com.lenovo.priestsql.schedule.dao.ScheduleDao;
import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.schedule.job.QueryJobBuilder;
import com.lenovo.priestsql.schedule.utils.VariableUtil;
import com.lenovo.priestsql.scheduler.SchedulerServer;
import com.lenovo.priestsql.web.entity.Page;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

	private static Logger logger = LoggerFactory.getLogger(ScheduleService.class);

	//Database affected record number
	private static final int AFFECT_RECODE_NUMBER = 1;

	@Autowired
	private ScheduleDao<?> dao;
	
	@Override
	public void addJob(QueryEntity queryEntity){
		try{
			VariableUtil.checkVariables(queryEntity.getSql(), queryEntity.getVariables());
			checkLegal(queryEntity);
			JobDetail jobDetail = QueryJobBuilder.jobDetailBuilder(getJobGroup(), queryEntity);
			Trigger trigger = QueryJobBuilder.cronTriggerBuilder(jobDetail,getJobGroup(), queryEntity);
			SchedulerServer.getInstance().getScheduler().scheduleJob(jobDetail, trigger);

			queryEntity.setExecution(trigger.getNextFireTime());
			initQueryEntity(queryEntity);
			dao.addJob(queryEntity);
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			if (e instanceof DuplicateKeyException || e instanceof ObjectAlreadyExistsException) {
				throw new RuntimeException(MessageKey.JOB_NAME_HAS_EXISTS, e);
			}else if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_ADD_FAILED, e);
			}
		}
	}

	@Override
	public void updateJob(QueryEntity queryEntity,boolean stopExecute) {
		try{
			VariableUtil.checkVariables(queryEntity.getSql(), queryEntity.getVariables());
			checkLegal(queryEntity);
			Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
			JobDetail jd = scheduler.getJobDetail(new JobKey(queryEntity.getJobName(),getJobGroup()));
			if(stopExecute && !stopExecutingJob(scheduler, jd)){
				throw new PriestsqlHuePlatException("Failed to stop job["+jd.getKey().getGroup()+":"+jd.getKey().getName()+"]");
			}
			if(!stopExecute && getJobExecutionContext(scheduler, jd) != null){
				throw new PriestsqlHuePlatException("["+jd.getKey().getGroup()+":"+jd.getKey().getName()+"] is running,can't be modified.");
			}
			JobDetail jobDetail = QueryJobBuilder.jobDetailBuilder(getJobGroup(), queryEntity);
			Trigger trigger = QueryJobBuilder.cronTriggerBuilder(jobDetail,getJobGroup(), queryEntity);
			scheduler.addJob(jobDetail, true);
			scheduler.rescheduleJob(trigger.getKey(),trigger);

			QueryEntity history = dao.getQueryEntity(queryEntity.getId());
			history.setName(history.getName()+ "_" + history.getVersion());
			history.setLatestVersion(false);
			if(dao.updateJob(history) == AFFECT_RECODE_NUMBER){
				initQueryEntity(queryEntity);
				queryEntity.setOwner(history.getOwner());
				queryEntity.setVersion(history.getVersion() + AFFECT_RECODE_NUMBER);
				queryEntity.setExecution(trigger.getNextFireTime());
				dao.addJob(queryEntity);
			}
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			 if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_UPDATE_FAILED, e);
			}
		}
	}

	@Override
	public void updateQueryEntity(QueryEntity queryEntity) {
		dao.updateJob(queryEntity);
	}

	private void checkLegal(QueryEntity queryEntity) throws ParseException,IOException {
		String sql = queryEntity.getSql();
		if (StringUtils.isNotEmpty(queryEntity.getVariables())) {
			sql = VariableUtil.replaceVariables(sql, queryEntity.getVariables());
		}
		HQLParseResult result = HQLParser.parse(sql);
		if(result.getHqls().size() > 1){
			throw new PriestsqlHueArgumentException("Multiple statements are not supported");
		}
		HQL hql = result.getHqls().iterator().next();
		if(hql.getOpType() == OperationType.QUERY){
			if(hql.createTempFile()){
				throw new PriestsqlHuePlatException("Scheduling query cannot return the query results,\n"
					+ " please specify target tables or HDFS directory.\n ");
			}else{
				Configuration config = ContextServer.getInstance().getConfig();
				boolean writeToLocalDir = config.getBoolean(PriestSqlConfiguration.ALLOW_QUERY_RESULTS_WRITE_TO_LOCAL_DIR,
						PriestSqlConfiguration.ALLOW_QUERY_RESULTS_WRITE_TO_LOCAL_DIR_DEFAULT);
				if(!writeToLocalDir && hql.writeToLocalDir()){
					throw new PriestsqlHuePlatException("Scheduling query results are forbidden to write local directory.");
				}
			}
		}
	}
	
	@Override
	public void deleteJob(int id, boolean stopExecute){
		QueryEntity qe = dao.getQueryEntity(id);
		Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
		try{
			JobDetail jd = scheduler.getJobDetail(new JobKey(qe.getJobName(),getJobGroup()));
			if (null != jd) {
				if(stopExecute && !stopExecutingJob(scheduler, jd)){
					throw new PriestsqlHuePlatException("Failed to stop  ["+jd.getKey().getGroup()+":"+jd.getKey().getName()+"]");
				}
				if(!stopExecute && getJobExecutionContext(scheduler, jd) != null){
					throw new PriestsqlHuePlatException("["+jd.getKey().getGroup()+":"+jd.getKey().getName()+"] is running,can't be deleted.");
				}
				scheduler.deleteJob(jd.getKey());
			}

			//qe.setDelete(true);
			//dao.updateJob(qe);
			dao.deleteJob(id);
			dao.deleteQueryExecutionRecord(id);
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_DELETE_FAILED, e);
			}
		}
	}

	@Override
	public void disableJob(int id) {
		QueryEntity qe = dao.getQueryEntity(id);
		Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
		try{
			JobDetail jd = scheduler.getJobDetail(new JobKey(qe.getJobName(),getJobGroup()));
			if (null != jd) {
				scheduler.pauseJob(jd.getKey());
			}

			qe.setDisable(true);
			dao.updateJob(qe);
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_OPERATE_FAILED, e);
			}
		}
	}

	@Override
	public void enableJob(int id) {
		QueryEntity qe = dao.getQueryEntity(id);
		Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
		try{
			JobDetail jd = scheduler.getJobDetail(new JobKey(qe.getJobName(),getJobGroup()));
			if (null != jd) {
				scheduler.resumeJob(jd.getKey());
			}

			qe.setDisable(false);
			dao.updateJob(qe);
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_OPERATE_FAILED, e);
			}
		}
	}

	@Override
	public boolean stopJob(int executionId, int jobId) {
		boolean success = false;
		try{
			QueryEntity queryEntity = dao.getQueryEntity(jobId);
			Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
			JobDetail jobDetail = QueryJobBuilder.jobDetailBuilder(getJobGroup(), queryEntity);
			if (getJobExecutionContext(scheduler, jobDetail) != null) {
				scheduler.interrupt(jobDetail.getKey());
			}
			QueryExecutionEntity queryExecutionRecord = dao.getQueryExecutionRecord(executionId);
			queryExecutionRecord.setEndDate(new Date());
			int duration = (int)(queryExecutionRecord.getEndDate().getTime() - queryExecutionRecord.getStartDate().getTime());
			queryExecutionRecord.setDuration(duration);
			queryExecutionRecord.setExecuteState(QueryExecutionEntity.ExecuteState.STOPPED.name());
			dao.updateQueryExecutionRecord(queryExecutionRecord);
			success = true;
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_OPERATE_FAILED, e);
			}
		}

		return success;
	}
	
	private boolean stopExecutingJob(Scheduler scheduler,JobDetail jd) {
		try{
			return getJobExecutionContext(scheduler, jd) != null ? scheduler.interrupt(jd.getKey()) : true;
		}catch(Throwable e){
			logger.error(e.getMessage(), e);
			return false;
		}
	}
	
	private JobExecutionContext getJobExecutionContext(Scheduler scheduler,JobDetail jd) throws SchedulerException{
		for(JobExecutionContext jec : scheduler.getCurrentlyExecutingJobs()){
			JobDetail executingJd = jec.getJobDetail();
			if(jd.getKey().getName().equals(executingJd.getKey().getName())){
				return jec;
			}
		}
		return null;
	}

	
	@Override
	public void reRunJob(int id) {
		try {
			QueryEntity qe = dao.getQueryEntity(id);
			Scheduler scheduler = SchedulerServer.getInstance().getScheduler();
			//Execute it now
			scheduler.triggerJob(new JobKey(qe.getJobName(), getJobGroup()));
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			if (e instanceof PriestsqlHuePlatException) {
				throw (RuntimeException) e;
			} else {
				throw new RuntimeException(MessageKey.JOB_OPERATE_FAILED, e);
			}
		}
	}

	@Override
	public Page<QueryEntity> queryJobs(String owner, int currentPage, int pageSize, boolean latest, Map<String, Object> parameters) {
		Page<QueryEntity> page = new Page<>();
		page.setPageIndex(currentPage);

		try {
			if (null == parameters) {
				parameters = new HashMap<>();
			}
			parameters.put("owner", owner);
			parameters.put("isDelete", false);
			parameters.put("latestVersion", latest);
			int count = dao.countQueryEntity(parameters);
			page.setTotal(count);

			int startIndex = currentPage > 0 ? (currentPage - 1) * pageSize : 0;
			parameters.put("startIndex", startIndex);
			parameters.put("pageSize", pageSize);
			List<QueryEntity> list = dao.findQueryEntityList(parameters);
			page.setRows(list);
		} catch (Throwable e) {
			String message = latest ? MessageKey.JOB_LIST_QUERY_FAILED : MessageKey.JOB_HISTORY_LIST_QUERY_FAILED;
			throw new RuntimeException(message, e);
		}

		return page;
	}
	
	@Override
	public int queryJobsCount(String owner,boolean latest) {
		int count = 0;

		try {
			Map<String, Object> parameters = new HashMap<>();
			parameters.put("owner", owner);
			parameters.put("latestVersion", latest);
			count = dao.countQueryEntity(parameters);
		} catch (Throwable e) {
			String message = latest ? MessageKey.JOB_LIST_QUERY_FAILED : MessageKey.JOB_HISTORY_LIST_QUERY_FAILED;
			throw new RuntimeException(message, e);
		}

		return  count;
	}

	@Override
	public QueryEntity getQueryEntity(int id) {
		return dao.getQueryEntity(id);
	}

	@Override
	public QueryEntity getQueryEntityByName(String owner, String name) {
		Map<String, Object> parameters = new HashMap<>();
		parameters.put("owner", owner);
		parameters.put("name", name);
		return dao.getQueryEntityByCondition(parameters);
	}
	
	@Override
	public void updateQueryExecutionRecord(QueryExecutionEntity qee) {
		dao.updateQueryExecutionRecord(qee);
	}

	@Override
	public void addQueryExecutionRecord(QueryExecutionEntity qee) {
		dao.addQueryExecutionRecord(qee);
	}

	@Override
	public Page<QueryExecutionEntity> getQueryExecutionEntityByQueryId(String owner, int currentPage, int pageSize, int queryId) {
		Page<QueryExecutionEntity> page = new Page<>();

		try {
			Map<String, Object> parameters = new HashMap<>();
			parameters.put("queryId", queryId);
			parameters.put("owner", owner);
			int count = dao.countQueryExecutionRecord(parameters);
			page.setTotal(count);

			int startIndex = currentPage > 0 ? (currentPage - 1) * pageSize : 0;
			parameters.put("startIndex", startIndex);
			parameters.put("pageSize", pageSize);
			parameters.put("sortColumns", "startDate");
			List<QueryExecutionEntity> list = dao.findQueryJobExecutionList(parameters);
			page.setRows(list);
		} catch (Throwable e) {
			throw new RuntimeException(MessageKey.JOB_EXECUTION_HISTORY_FAILED, e);
		}

		return page;
	}

	@Override
	public Page<QueryExecutionEntity> findQueryExecutionEntityList(String owner, int currentPage, int pageSize, Map<String, Object> parameters) {
		Page<QueryExecutionEntity> page = new Page<>();
		page.setPageIndex(currentPage);

		try {
			if (null == parameters) {
				parameters = new HashMap<>();
			}
			parameters.put("owner", owner);

			int count = dao.countQueryExecutionRecord(parameters);
			page.setTotal(count);

			int startIndex = currentPage > 0 ? (currentPage - 1) * pageSize : 0;
			parameters.put("startIndex", startIndex);
			parameters.put("pageSize", pageSize);
			List<QueryExecutionEntity> list = dao.findQueryJobExecutionList(parameters);
			page.setRows(list);
		} catch (Throwable e) {
			throw new RuntimeException(MessageKey.JOB_EXECUTION_HISTORY_FAILED, e);
		}

		return page;
	}

	private String getJobGroup(){
		Configuration conf = ContextServer.getInstance().getConfig();
		return conf.get(PriestSqlConfiguration.QUARTZ_JOB_GROUP_NAME,PriestSqlConfiguration.QUARTZ_JOB_GROUP_NAME_DEFAULT);
	}

	private void initQueryEntity(QueryEntity queryEntity) {
		queryEntity.setCreateDate(new Date());
		queryEntity.setDisable(false);
		queryEntity.setDelete(false);
		queryEntity.setVersion(1);
		queryEntity.setLatestVersion(true);
	}
}