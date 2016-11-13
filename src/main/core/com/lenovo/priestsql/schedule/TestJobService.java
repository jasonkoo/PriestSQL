package com.lenovo.priestsql.schedule;

import com.alibaba.fastjson.JSON;
import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.schedule.service.ScheduleService;
import com.lenovo.priestsql.web.entity.Page;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhengwei16 on 2016/9/8.
 */
//@Component
public class TestJobService implements InitializingBean{

	@Autowired
	private ScheduleService ss;

	@Override
	public void afterPropertiesSet() {
		try {
			// Add job
			QueryEntity qe = testAddJob();
			System.err.println("Add job result:" + JSON.toJSON(qe));

			// Query  the job list
			Map<String, Object> filters = new HashMap<>();
			Page<QueryEntity> pager = ss.queryJobs("andy", 1, 100, false, filters);
			System.err.println("Query the job list result: " + JSON.toJSON(pager));

			// Query the job execution list
			Page<QueryExecutionEntity> executionPage = ss.findQueryExecutionEntityList("andy", 1, 100, filters);
			System.err.println("Query the job execution list result:" + JSON.toJSON(executionPage));

			// Update the job
			qe.setCronExpr("0 36 * * * ?");
			ss.updateJob(qe, false);
			System.err.println("Updated the job: " + JSON.toJSON(qe));

			// Disable/Enable the job
			ss.disableJob(qe.getId());
			ss.enableJob(qe.getId());

			// Stop/Start the job
			QueryExecutionEntity queryExecutionEntity = executionPage.getRows().get(0);
			int queryId = queryExecutionEntity.getQueryId();
			ss.stopJob(queryExecutionEntity.getId(), queryId);
			executionPage = ss.findQueryExecutionEntityList("andy", 1, 100, filters);
			System.err.println("Stop the job execution result:" + JSON.toJSON(executionPage));

			ss.reRunJob(queryId);
			executionPage = ss.findQueryExecutionEntityList("andy", 1, 100, filters);
			System.err.println("Start the job execution result:" + JSON.toJSON(executionPage));

			// Delete the job
			ss.deleteJob(qe.getId(), true);
		} catch (Exception e) {
			e.printStackTrace(System.err);
		}
	}


	private QueryEntity testAddJob() throws Exception {
		QueryEntity qe = new QueryEntity();
		qe.setOwner("andy");
		qe.setCronExpr("0 35 * * * ?");
		qe.setDatabaseName("default");
//		qe.setDatasourceId(71); // hive
		qe.setDatasourceId(73); // spark
		qe.setName("andy-test" + System.currentTimeMillis());
		qe.setSql("INSERT OVERWRITE TABLE tmp.job_testing PARTITION(orders) SELECT * from default.customers limit 1;"); // hive/spark
		qe.setExecutePeriod("按分钟调度");
		ss.addJob(qe);

		return qe;
	}
}
