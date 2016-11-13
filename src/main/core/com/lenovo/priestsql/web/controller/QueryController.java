package com.lenovo.priestsql.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.hive.jdbc.HiveStatement;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.client.RedisServerClient;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.entity.Page;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.QueryHistory;
import com.lenovo.priestsql.web.entity.QueryHistory.RunningstateEnum;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.service.HistoryService;
import com.lenovo.priestsql.web.thread.QueryThread;
import com.lenovo.priestsql.web.utils.ConnectionType;
import com.lenovo.priestsql.web.utils.HDFSUtil;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.Md5Util;
import com.lenovo.priestsql.web.utils.PrettySQLFormatter;
import com.lenovo.priestsql.web.utils.ResponseCode;
import com.lenovo.priestsql.web.utils.SqlUtil;

@RequestMapping("/")
@RestController
public class QueryController {

	Logger logger = Logger.getLogger(QueryController.class);

	@Autowired
	private HistoryService qhs;
	@Autowired
	private ConnectionService cs;

	private final String PROCESSING="processing ...";
	private final String FINISHED="finished";
	private final String EXPIRED="result expired";
	private final String CANCELED="canceled";
	// 用来保存提交了任务的STATEMENTS
	public static HashMap<String, Statement> STATEMENTS = new HashMap<String, Statement>();

	public static final String LANGUAGE = ContextServer
			.getInstance()
			.getConfig()
			.get(PriestSqlConfiguration.LANGUAGE,
					PriestSqlConfiguration.LANGUAGE_DEFAULT);

	private static final ThreadLocal<StringBuilder> BUILDERS = new ThreadLocal<StringBuilder>() {
		@Override
		protected StringBuilder initialValue() {
			return new StringBuilder();
		}
	};

	private int EXPIRTIME = ContextServer
			.getInstance()
			.getConfig()
			.getInt(PriestSqlConfiguration.REDIS_EXPIRTIME,
					PriestSqlConfiguration.REDIS_EXPIRTIME_DEFAULT);

	@RequestMapping("applySql")
	public Object applySql(HttpSession session, Param param,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			if (ContextServer.getInstance().getForbidSubmitTask()) {
				if ("en".equals(LANGUAGE)) {
					return new JsonResult(ResponseCode.FAIL, ContextServer
							.getInstance().getForbidSubmitTaskReasonEn());
				}
				return new JsonResult(ResponseCode.FAIL, ContextServer
						.getInstance().getForbidSubmitTaskReasonZh());
			}
			// 获取连接，判断连接类型
			CustomConnection cc = cs.getConnection(param.getConnId());
			param.setCustomConnection(cc);
			param.setOrginal_sql(param.getSql());
			String key = "";
			// 判断提交的请求是否是查询全记录，如果是，则使用之前的querykey加后缀，让两次查询相关联
			if (param.getForBigData() == 1) {
				key = param.getQueryKey() + "_fb";
			} else {
				key = Md5Util.MD5(param.getConnId() + param.getDbName()
						+ param.getSql() + param.getProxyUserName()
						+ new Date().getTime());
			}
			String countKey = key + "_count";
			param.setQueryKey(key);
			param.setQueryCountKey(countKey);
			SqlUtil.setParam(param);
			// 如果是会创建临时表的查询进行全量下载，则不必再进行查询，直接返回key
			// 保存查询参数状态
			RedisServerClient.set(key + "_param", param, EXPIRTIME);
			if (!(param.isCreatedTmpTable() && param.getForBigData() == 1)) {
				QueryThread qt = new QueryThread(param, key);
				ContextServer.getInstance().getTaskServer().getTaskExecutor()
						.execute(qt);
			}

			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("queryKey", key);
			map.put("queryCountKey", countKey);
			try {
				// 判断是否是全量查询，如果是，则只更新全量查询标志
				if (param.getForBigData() == 1) {
					QueryHistory qh = new QueryHistory();
					qh.setQueryKey(key);
					qh.setForBigData(1);
					qh.setRunningState(RunningstateEnum.FINISHED);
					qhs.updateQueryHistory(qh);
				} else {
					QueryHistory qh = new QueryHistory(param);
					qh.setLoginName((String) session.getAttribute("username"));
					qh.setQueryTypeEnum(cc.getConnectTypeEnum());
					qh.setConnId(cc.getId());
					qh.setQueryKey(key);
					qh.setQueryCountKey(countKey);
					qh.setDate(new Date());
					qhs.saveQueryHistory(qh);
				}
			} catch (Exception e) {
				logger.error(e, e);
			}
			return new JsonResult(map,param.getQueryIndex());
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage(),param.getQueryIndex());
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping("query")
	public Object query(Param param) {
		try {
			String key = param.getQueryKey();
			int queryIndex=param.getQueryIndex();
			// 如果缺少key，则直接返回空
			if (key == null) {
				return new JsonResult(null);
			}
			String countKey = key + "_count";
			// 判断是否出错，如果spark出错，重新提交到hive
			if (RedisServerClient.exists(key + "_e")) {
				String e = RedisServerClient.get(key + "_e");
				return new JsonResult(ResponseCode.FAIL, e,queryIndex);
			}
			// 判断是否是大数据量查询，如果是，且运行完成，则返回完成标志给前端，由前端生成下载链接
			if (param.getForBigData() == 1) {
				if (RedisServerClient.exists(key + "_path")) {
					return new JsonResult(ResponseCode.FINISHED, FINISHED,queryIndex);
				} else {
					return new JsonResult(PROCESSING,queryIndex);
				}
			}
			// 判断缓存中是否存有查询结果，如果有，则返回查询结果，如果没有，则判断是没有运行完成还是，已经过期
			if (RedisServerClient.exists(countKey)) {
				List<Object> list = RedisServerClient.get(key, param.getPage());
				if (list == null) {
					return new JsonResult(ResponseCode.FINISHED, new Page<Object>(),queryIndex);
				}
				List<String> fields = RedisServerClient.get(key + "_field",
						List.class);
				int count = Integer.parseInt(RedisServerClient.get(countKey));
				Page<Object> page = new Page<Object>();
				List _list = formateList(fields, list);
				page.setRows(_list);
				page.setTotal(count);
				page.setPageIndex(param.getPage());
				page.setHeader(fields);
				return new JsonResult(ResponseCode.FINISHED, page,queryIndex);
			} else {
				if (param.getIsHistory() == 0 && checkStatFromMysql(key) == 1) {
					return new JsonResult(PROCESSING,queryIndex);
				} else {
					return new JsonResult(ResponseCode.EXPIRED, EXPIRED,queryIndex);
				}
			}
		} catch (Throwable e) {
			logger.error(e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage(),param.getQueryIndex());
		}
	}

	@RequestMapping("logs")
	public Object logs(Param param) {
		try {
			String key = param.getQueryKey();
			Param storedParam = RedisServerClient.get(key + "_param",
					Param.class);
			int queryIndex= param.getQueryIndex();
			// 如果缺少key，则直接返回空
			if (key == null) {
				return new JsonResult(null);
			}
			// 出现错误信息，终止任务，
			if (RedisServerClient.exists(key + "_e")) {
				String e = RedisServerClient.get(key + "_e");
				logger.error(e);
				return new JsonResult(ResponseCode.FAIL, e,queryIndex);
			}
			// 判断是否执行结束，如果执行结束，返回对应的标识
			String countKey = key + "_count";
			boolean finished = false;
			if (RedisServerClient.exists(countKey)) {
				finished = true;
			}
			StringBuilder sb = BUILDERS.get();
			ConnectionType ct = storedParam.getCustomConnection()
					.getConnectTypeEnum();
			if (ct == ConnectionType.HIVE) {
				HiveStatement st = (HiveStatement) STATEMENTS.get(key);
				if (st != null && !st.isClosed()) {
					try {
						List<String> logs = st.getQueryLog(true, 50);
						if (logs != null) {
							for (String log : logs) {
								sb.append(log).append("\n");
							}
						}
					} catch (Exception e) {
					}
				} else {
					sb.append("there is no available logs");
				}
			} else {
				sb.append("there is no available logs");
			}
			HashMap<String, Object> result=new HashMap<String, Object>();
			if (finished) {
				Object[] obj = getQueryTimeStat(param);
				result.put("costTime", obj[0]);
				result.put("finishTime", obj[1]);
			}
			result.put("message", sb.toString());
			sb.setLength(0);
			return new JsonResult(finished ? ResponseCode.FINISHED
					: ResponseCode.SUCCESS, result,queryIndex);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage(),param.getQueryIndex());
		}
	}

	@RequestMapping("cancelJob")
	public Object cancelJob(Param param) {
		try {
			String key = param.getQueryKey();
			//更新一次查询日志的状态，防止后台取消失败
			QueryHistory qh = new QueryHistory();
			qh.setQueryKey(key);
			qh.setRunningState(RunningstateEnum.STOP);
			qh.setFinishDate(System.currentTimeMillis());
			qhs.updateQueryHistory(qh);
			int queryIndex= param.getQueryIndex();
			Statement st = STATEMENTS.get(key);
			if (st != null) {
				st.cancel();
				STATEMENTS.remove(key);
			} else {
				Thread.sleep(1500);
				st = STATEMENTS.get(key);
				if (st != null) {
					st.cancel();
					STATEMENTS.remove(key);
				}
			}
			return new JsonResult(ResponseCode.SUCCESS, CANCELED,queryIndex);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage(),param.getQueryIndex());
		}
	}

	@RequestMapping("downloadFile")
	public void downloadFile(Param param, HttpServletResponse response) {
		if (RedisServerClient.exists(param.getQueryKey() + "_path")
				|| RedisServerClient.exists(param.getQueryKey() + "_path_1000")) {
			String _path = RedisServerClient.get(param.getQueryKey() + "_path");
			String _path_1000 = RedisServerClient.get(param.getQueryKey()
					+ "_path_1000");
			Param storedParam = RedisServerClient.get(param.getQueryKey()
					+ "_param", Param.class);
			// 如果是创建临时表，则从hdfs中读取
			if (storedParam.isCreatedTmpTable() && param.getForBigData() == 1) {
				HDFSUtil.downloadTmpFile(param.getQueryKey(), _path,
						storedParam.getProxyUserName(), response);
			} else {
				String path = param.getForBigData() == 1 ? _path : _path_1000;
				File file = new File(path);
				// 1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
				response.setContentType("multipart/form-data");
				// 2.设置文件头：最后一个参数是设置下载文件名(假如我们叫a.pdf)
				response.setHeader(
						"Content-Disposition",
						"attachment;fileName="
								+ path.substring(path.lastIndexOf("/") + 1));
				ServletOutputStream out;
				try {
					FileInputStream inputStream = new FileInputStream(file);

					// 3.通过response获取ServletOutputStream对象(out)
					out = response.getOutputStream();

					int b = 0;
					byte[] buffer = new byte[512];
					while ((b = inputStream.read(buffer)) != -1) {
						// 4.写到输出流(out)中
						out.write(buffer, 0, b);
					}
					inputStream.close();
					out.flush();
					out.close();
				} catch (Exception e) {
					logger.error(e, e);
				}
			}
		} else {
			try {
				response.getWriter().write("no such file!");
			} catch (IOException e) {
				logger.error(e, e);
			}
		}
	}

	@RequestMapping("getQueryHistory")
	public Object getQueryHistory(Param param, HttpSession session) {
		try {
			param.setLoginName((String) session.getAttribute("username"));
			List<QueryHistory> list = qhs.getQuertHistory(param);
			return new JsonResult(list);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}

	/**
	 * 格式化sql
	 * 
	 * @param param
	 * @return
	 */
	@RequestMapping("formateSql")
	public Object formateSql(Param param) {
		try {
			return new JsonResult(PrettySQLFormatter.getPerttySql(param
					.getSql()));
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}

	}

	/**
	 * 从mysql获得查询的运行状态
	 * 
	 * @param queryKey
	 * @return
	 */
	private int checkStatFromMysql(String queryKey) {
		try {
			Param param = new Param();
			param.setQueryKey(queryKey);
			int state = qhs.getQueryState(param);
			return state;
		} catch (Exception e) {
			logger.error(e, e);
			throw e;
		}
	}

	@SuppressWarnings("rawtypes")
	private List formateList(List<String> fields, List<Object> list) {
		List<List<String>> tempList = new ArrayList<List<String>>();
		for (Object obj : list) {
			JSONObject jo = (JSONObject) obj;
			List<String> temp = new ArrayList<String>();
			for (String field : fields) {
				temp.add(jo.getString(field));
			}
			tempList.add(temp);
		}
		return tempList;
	}

	/**
	 * 获取查询时间使用情况
	 * 
	 * @param param
	 * @return
	 */
	private Object[] getQueryTimeStat(Param param) {
		QueryHistory qh = qhs.getQuertTime(param);
		long st = qh.getDate().getTime();
		long fin = qh.getFinishDate();
		Date d = new Date(fin);
		long usedTime = fin - st;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.S");
		Object[] obj = { usedTime, sdf.format(d) };
		return obj;
	}
}
