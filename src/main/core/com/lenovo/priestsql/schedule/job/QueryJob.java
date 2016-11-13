package com.lenovo.priestsql.schedule.job;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.hive.ql.parse.ParseException;
import org.apache.log4j.Logger;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.UnableToInterruptJobException;

import com.lenovo.priestsql.hql.HQLParseResult;
import com.lenovo.priestsql.hql.HQLParser;
import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.schedule.service.ScheduleService;
import com.lenovo.priestsql.schedule.utils.VariableUtil;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.utils.ConnUtil;
import com.lenovo.priestsql.web.utils.ContextUtil;

@DisallowConcurrentExecution
public class QueryJob implements InterruptableJob {
	private static final Logger LOG = Logger.getLogger(QueryJob.class);

	private ScheduleService querySchedulerService = ContextUtil.getBean(ScheduleService.class);
	private ConnectionService connectionService = ContextUtil.getBean(ConnectionService.class);

	private ThreadLocal<JobDetail> jobDetailThreadLocal = new ThreadLocal<>();
	private ThreadLocal<Statement> statementThreadLocal = new ThreadLocal<>();

	private final static List<String> HIVE_EXEC_DYNAMIC_PARTITION_STATEMENTS = new ArrayList<String>(){
		{
			this.add("set hive.exec.dynamic.partition=true");
			this.add("set hive.exec.dynamic.partition.mode=nonstrict");
		}
	};

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		QueryExecutionEntity qee = null;
		Throwable throwable = null;
		try {
			JobDetail jd = context.getJobDetail();
			jobDetailThreadLocal.set(jd);
			JobKey jk = jd.getKey();
			String[] names = jk.getName().split("@@");
			String owner = null;
			String name = null;
			if (names.length == 2) {
				owner = names[0];
				name = names[1];
			}
			QueryEntity qe = querySchedulerService.getQueryEntityByName(owner, name);
			qee = getQueryExecutionEntity(qe);
			querySchedulerService.addQueryExecutionRecord(qee);
			if (qe == null) {
				LOG.error("Metadata of [" + jk.getGroup() + ":" + jk.getName() + "] doesn't exist");
			} else {
				CustomConnection cc = connectionService.getConnection(qe.getDatasourceId());
				if (cc == null) {
					LOG.error("Can't obtain connection from [" + qe.getDatasourceId() + "] datasource");
				} else {
					Connection connection = ConnUtil.getConnection(cc, qe.getProxyUser());
					execute(qe, connection);
				}
			}
		} catch (Throwable e) {
			throwable = e;
		} finally {
			update(context, qee, throwable);
		}
	}

	private void update(JobExecutionContext context, QueryExecutionEntity qee, Throwable e) {
		if (qee != null) {
			qee.setEndDate(new Date());
			qee.setDuration((int) (qee.getEndDate().getTime() - qee.getStartDate().getTime()));
			if (e != null) {
				qee.setExecuteState(QueryExecutionEntity.ExecuteState.FAILED.name());
				try (StringWriter sw = new StringWriter(); PrintWriter pw = new PrintWriter(sw);) {
					e.printStackTrace(pw);
					qee.setLog(sw.toString());
				} catch (IOException ioe) {/*Do nothing*/}
			} else {
				qee.setExecuteState(QueryExecutionEntity.ExecuteState.SUCCESS.name());
			}
			querySchedulerService.updateQueryExecutionRecord(qee);
			if (null != context.getNextFireTime()) { // The next fire time is null for the once task .
				QueryEntity queryEntity = querySchedulerService.getQueryEntity(qee.getQueryId());
				queryEntity.setExecution(context.getNextFireTime());
				querySchedulerService.updateQueryEntity(queryEntity);
			}
		} else if (e != null) {
			LOG.error(e);
		}
	}

	private QueryExecutionEntity getQueryExecutionEntity(QueryEntity qe) {
		QueryExecutionEntity qee = new QueryExecutionEntity();
		qee.setExecuteState(QueryExecutionEntity.ExecuteState.RUNNING.name());
		qee.setName(qe.getName());
		qee.setOwner(qe.getOwner());
		qee.setQueryId(qe.getId());
		qee.setStartDate(new Date());
		return qee;
	}

	private void execute(QueryEntity qe, Connection connection) throws SQLException, ParseException, IOException {
		Statement statement = null;
		try {
			statement = connection.createStatement();
			statementThreadLocal.set(statement);
			String sql = qe.getSql();
			if (StringUtils.isNotEmpty(qe.getVariables())) {
				sql = VariableUtil.replaceVariables(sql, qe.getVariables());
			}
			HQLParseResult hpr = HQLParser.parse(sql);
			boolean success = false;
			if (StringUtils.isNotEmpty(qe.getDatabaseName())) {
				statement.execute("use " + qe.getDatabaseName());
			}
			for (String set : hpr.getSets()) {
				success = statement.execute(set);
				if (!success) {
					LOG.error(String.format("Failed to execute '%s'", set));
				}
			}
			if (!HIVE_EXEC_DYNAMIC_PARTITION_STATEMENTS.isEmpty()) {
				for (String stmt : HIVE_EXEC_DYNAMIC_PARTITION_STATEMENTS) {
					success = statement.execute(stmt);
					if (!success) {
						LOG.error(String.format("Failed to execute '%s'", stmt));
					}
				}
			}
			String[] sqlList = sql.split("\\;");
			for (String hql : sqlList) {
				success = statement.execute(hql);
				if (!success) {
					LOG.error(String.format("Failed to execute '%s'", hql));
				}
			}
		} finally {
			if (statement != null) {
				statement.close();
				statementThreadLocal.set(null);
			}
			if (null != connection) {
				connection.close();
			}
		}
	}

	@Override
	public void interrupt() throws UnableToInterruptJobException {
		Statement statement = statementThreadLocal.get();
		JobDetail jobDetail = jobDetailThreadLocal.get();
        Connection connection = null;

		try {
			if (statement != null) {
				connection = statement.getConnection();
				statement.cancel();
			}
			if (jobDetail != null) {
				JobKey jk = jobDetail.getKey();
				LOG.warn("Query of '" + jk.getGroup() + ":" + jk.getName() + "' was cancelled.");
			}
		} catch (SQLException e) {
			LOG.error(e);
		} finally {
			if (statement != null) {
				try {
					statement.close();
					statementThreadLocal.set(null);
					jobDetailThreadLocal.set(null);
				} catch (SQLException e) {
					LOG.error("Can't close Statement", e);
				}
			}
			if (null != connection) {
				try {
					connection.close();
				} catch (SQLException e) {
					LOG.error("Can't close connection", e);
				}
			}
		}
	}
}