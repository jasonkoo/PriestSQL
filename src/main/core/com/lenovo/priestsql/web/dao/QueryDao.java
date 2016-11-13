package com.lenovo.priestsql.web.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.ColumnMapRowMapper;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.controller.QueryController;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.utils.ConnUtil;
import com.lenovo.priestsql.web.utils.FileWriterUtil;
import com.lenovo.priestsql.web.utils.SqlUtil;

/**
 * 自定义查询dao
 * 
 * @author zhouyu16
 *
 */
@Repository
public class QueryDao {

	private Logger logger = Logger.getLogger(QueryDao.class);
	private ThreadLocal<Integer> forBigData=new ThreadLocal<Integer>();
	private ThreadLocal<String> queryKeys=new ThreadLocal<String>();
	
	
	public Object sqlExecute(String queryKey, String sql, CustomConnection cc,
			String proxyUser, boolean isCreatedTmpTable, int forBigData) throws Exception {
		Connection con = ConnUtil.getConnection(cc, proxyUser);
		this.forBigData.set(forBigData);
		this.queryKeys.set(queryKey);
		if (con == null) {
			throw new RuntimeException("Failed to get connection");
		}
		Object value = null;
		try {
			if (StringUtils.isNotEmpty(sql)) {
				// new Statement，防止资源泄露 OOM
				Statement stmt = con.createStatement();
				QueryController.STATEMENTS.put(queryKey, stmt);
				try {
					value = executeOneSql(stmt, sql.trim(), queryKey,
							isCreatedTmpTable);
				} finally {
					if (stmt != null) {
						stmt.close();
					}
				}
			}
		} catch (Exception e) {
			logger.error(e, e);
			throw e;
		} finally {
			if (con != null) {
				con.close();
			}
		}

		return value;
	}

	private Object executeOneSql(Statement stmt, String trimmedSql,
			String queryKey, boolean isCreatedTmpTable) throws Exception {
		Object value = null;
		//判断是否是创建存储过程
		if(SqlUtil.ifFunction(trimmedSql)){
			String settingSQL=trimmedSql.split(";", 2)[0].replace("CREAT_FUNCTION_SQL::", "")+";";
			String creatSQL=trimmedSql.split(";", 2)[1];
			stmt.execute(settingSQL);
			stmt.execute(creatSQL);
		}else{
			// 分析sql操作类型(ddl,select or insert)
			HashMap<String, String> map = new HashMap<String, String>();
			trimmedSql = SqlUtil.preFomate(trimmedSql, map, "[\"\'](.*?)[\"\']");
			String[] sqls = trimmedSql.split(";");
			for (String sql : sqls) {
				sql = SqlUtil.afterFomate(sql, map).trim();
				logger.error("####--" + sql);
				if (isCreatedTmpTable
						&& sql.startsWith("CREATE TABLE tmp.tmptable_")) {
					// 执行语句，创建临时表
					stmt.execute(sql);
					// 从临时表中获取1000条数据
					String tmpSql = "select * from tmp.tmptable_"
							+ queryKey.toLowerCase() + " limit "
							+ ContextServer
							.getInstance()
							.getConfig()
							.getInt(PriestSqlConfiguration.QUERY_LIMIT,
									PriestSqlConfiguration.QUERY_LIMIT_DEFAULT);
					logger.error("####--" + tmpSql);
					value = executeQuery(stmt, tmpSql);
				} else{
					value = executeQuery(stmt, sql);
				}
	
			}
		}
		return value;
	}

	/**
	 * 执行select查询语句
	 * 
	 * @param stmt
	 * @param trimmedSql
	 * @return
	 * @throws SQLException
	 */
	@SuppressWarnings("unchecked")
	private Object executeQuery(Statement stmt, String trimmedSql)
			throws Exception {
		Object value = null;
		ResultSet rs = null;
		RowMapper<Map<String, Object>> rowMapper = new ColumnMapRowMapper();
		ResultSetExtractor<List<Map<String, Object>>> extractor = new RowMapperResultSetExtractor<Map<String, Object>>(
				rowMapper);
		try {
			rs = stmt.executeQuery(trimmedSql);
			if(this.forBigData.get()==0){
				value = extractor.extractData(rs);
			}else{
				value = new ArrayList<Object>();
				((ArrayList<Object>)value).add(FileWriterUtil.writeFile(rs,this.queryKeys.get()));
			}
		} catch (Exception e) {
			if(e.getMessage()!=null&&(e.getMessage().contains("ResultSet is from UPDATE. No Data")||e.getMessage().contains("No results were returned by the query")||e.getMessage().contains("查询没有传回任何结果")||e.getMessage().contains("The query did not generate a result set"))){
				return null;
			}else{
				logger.error(e, e);
				throw e;
			}
		} finally {
			if (rs != null) {
				rs.close();
			}
		}

		return value;
	}

}
