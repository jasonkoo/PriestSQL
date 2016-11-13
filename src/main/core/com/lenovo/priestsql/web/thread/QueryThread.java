package com.lenovo.priestsql.web.thread;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.task.AbstractTask;
import com.lenovo.priestsql.web.client.RedisServerClient;
import com.lenovo.priestsql.web.controller.QueryController;
import com.lenovo.priestsql.web.dao.QueryDao;
import com.lenovo.priestsql.web.dao.dataSource.DataSourceContextHolder;
import com.lenovo.priestsql.web.dao.mapper.QueryHistoryMapper;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;
import com.lenovo.priestsql.web.entity.QueryHistory.RunningstateEnum;
import com.lenovo.priestsql.web.utils.ContextUtil;
import com.lenovo.priestsql.web.utils.FileWriterUtil;

/**
 * 提交sql进行查询的线程
 * 
 * @author zhouyu16
 *
 */
public class QueryThread extends AbstractTask {

	Logger logger = Logger.getLogger(QueryThread.class);

	private String key;
	private String countKey;
	private Param param;
	private QueryDao queryDao;
	private QueryHistoryMapper queryHistoryMapper;
	private int expirtime = 0;

	public QueryThread(Param param, String key) {
		super("query-thread-" + key);
		Thread.currentThread().setName("query-thread-" + key);
		this.key = key;
		this.countKey = key + "_count";
		this.param = param;
		this.queryDao = ContextUtil.getBean(QueryDao.class);
		this.queryHistoryMapper = ContextUtil.getBean(QueryHistoryMapper.class);
		this.expirtime = ContextServer
				.getInstance()
				.getConfig()
				.getInt(PriestSqlConfiguration.REDIS_EXPIRTIME,
						PriestSqlConfiguration.REDIS_EXPIRTIME_DEFAULT);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void run() {
		QueryHistory qh = new QueryHistory();
		qh.setQueryKey(key);
		try {
			// 将执行状态修改为正在执行
			qh.setRunningState(RunningstateEnum.RUNNING);
			// 全量查询时不修改执行状态
			if (param.getForBigData() != 1) {
				DataSourceContextHolder.setDataSourceType("main");
				queryHistoryMapper.updateQueryHistory(qh);
			}

			Object obj = queryDao.sqlExecute(param.getQueryKey(),
					param.getSql(), param.getCustomConnection(),
					param.getProxyUserName(), param.isCreatedTmpTable(),
					param.getForBigData());
			// 查询结束时间
			qh.setFinishDate(System.currentTimeMillis());
			// 时间字段立即更新，以免出现冲突
			if (param.getForBigData() != 1) {
				DataSourceContextHolder.setDataSourceType("main");
				queryHistoryMapper.updateQueryHistory(qh);
			}
			if (obj != null) {
				if (obj instanceof List) {
					List<Object> list = (List<Object>) obj;
					saveTheResult(list);
				} else {
					RedisServerClient.set(countKey, 1, expirtime);
					RedisServerClient.set(key, obj, expirtime);
				}
			} else {
				RedisServerClient.set(countKey, 0, expirtime);
				RedisServerClient.set(key, "NULL", expirtime);
			}
			qh.setRunningState(RunningstateEnum.FINISHED);

		} catch (Exception e) {
			// 查询结束时间
			qh.setFinishDate(System.currentTimeMillis());
			// 时间字段立即更新，以免出现冲突
			if (param.getForBigData() != 1) {
				DataSourceContextHolder.setDataSourceType("main");
				queryHistoryMapper.updateQueryHistory(qh);
			}
			logger.error(e);
			// 如果是被取消，则将状态修改为stop，就不用在Controller里进行状态修改了
			if (e.getMessage().contains("Query was cancelled")) {
				qh.setRunningState(RunningstateEnum.STOP);
			} else {
				qh.setRunningState(RunningstateEnum.ERROR);
				qh.setErrorMessage(e.getMessage()==null?"NullPointerException":e.getMessage().substring(0, Math.min(e.getMessage().length(), 500)));
			}
			RedisServerClient.set(key + "_e", e.getMessage(), expirtime);
		}

		// 全量查询时不修改执行状态
		if (param.getForBigData() != 1) {
			DataSourceContextHolder.setDataSourceType("main");
			if (param.isCreatedTmpTable()
					&& qh.getRunningState() == RunningstateEnum.FINISHED
							.getValue()) {
				qh.setCreateTmpTable(1);
				qh.setTmpTable("tmp.tmptable_" + key.toLowerCase());
			}
			queryHistoryMapper.updateQueryHistory(qh);
		}
		// 查询结束，删除保存的statement
		QueryController.STATEMENTS.remove(key);
	}

	@SuppressWarnings("unchecked")
	private void saveTheResult(List<Object> list) {
		if (param.getForBigData() == 0) {
			int count = list.size();
			List<String> fields = count > 0 ? new ArrayList<String>(
					((HashMap<String, String>) list.get(0)).keySet())
					: new ArrayList<String>();
			RedisServerClient.set(countKey, count);
			RedisServerClient.set(key + "_field", fields);
			RedisServerClient.set(key, list, param.getPageSize() == 0 ? 100
					: param.getPageSize(), expirtime);
			String path = FileWriterUtil.writeExcel(list, key);
			RedisServerClient.set(key + "_path_1000", path, expirtime);
		} else if (param.getForBigData() != 0) {
			RedisServerClient.set(countKey, 1);
			RedisServerClient.set(key + "_path", list.get(0), expirtime);
		}

		if (param.isCreatedTmpTable()) {
			String path = "user/hive/071/warehouse/tmp.db/tmptable_"
					+ key.toLowerCase() + "/";
			RedisServerClient.set(key + "_fb_path", path, expirtime);
		}
	}

	@Override
	public int compareTo(AbstractTask o) {
		return 0;
	}
}
