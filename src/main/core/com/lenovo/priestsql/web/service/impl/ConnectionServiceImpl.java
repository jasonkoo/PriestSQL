package com.lenovo.priestsql.web.service.impl;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Service;

import com.lenovo.priestsql.web.dao.dataSource.DataSourceContextHolder;
import com.lenovo.priestsql.web.dao.mapper.CustomConnectionMapper;
import com.lenovo.priestsql.web.entity.Column;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.entity.MysqlColumn;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.PostgresqlColumn;
import com.lenovo.priestsql.web.entity.Table;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.utils.ConnUtil;
import com.lenovo.priestsql.web.utils.ConnectionType;

@Service
public class ConnectionServiceImpl implements ConnectionService {

	@Autowired
	private CustomConnectionMapper ccm;

	private static Logger logger = Logger
			.getLogger(ConnectionServiceImpl.class);

	private static List<String> POSTGRESQLSYSTEMSCHEMA=Arrays.asList(new String[]{"pg_toast","pg_bitmapindex","pg_aoseg","pg_catalog","information_schema"});
	
	@Override
	public boolean saveConnection(CustomConnection cc) {
		DataSourceContextHolder.setDataSourceType("main");
		return ccm.saveConnection(cc) > 0;
	}

	@Override
	public boolean updateConnection(CustomConnection cc) {
		DataSourceContextHolder.setDataSourceType("main");
		return ccm.updateConnection(cc) > 0;
	}

	@Override
	public List<CustomConnection> getConnections(String lenovoid) {
		DataSourceContextHolder.setDataSourceType("main");
		return ccm.getConnections(lenovoid);
	}

	@Override
	public CustomConnection getConnection(int id) {
		DataSourceContextHolder.setDataSourceType("main");
		return ccm.getConnection(id);
	}

	@Override
	public CustomConnection getConnectionForCleanTask(int id) {
		DataSourceContextHolder.setDataSourceType("main");
		return ccm.getConnectionForCleanTask(id);
	}

	@Override
	public boolean delConnection(int id) {
		DataSourceContextHolder.setDataSourceType("main");
		if (ccm.delConnection(id) > 0)
			return true;
		return false;
	}

	@Override
	public Map<Object, Object> searchDAT(Param param) throws Exception {
		CustomConnection cc = param.getCustomConnection();
		Connection conn = ConnUtil.getConnection(cc, null);
		if (conn == null) {
			return null;
		}
		//是否在连接串中指定数据库
		String filter = getFilter(cc);
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		StringBuilder pattern = new StringBuilder();
		if (cc.getConnectTypeEnum() == ConnectionType.MYSQL
				|| cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
			pattern.append("%").append(param.getParamString()).append("%");
		} else {
			pattern.append("*").append(param.getParamString()).append("*");
		}
		// get databases;
		List<String> dbLsit = getDatabase(conn, pattern.toString(),
				cc.getConnectTypeEnum());
		// get tables;
		List<Table> tblList = new ArrayList<Table>();
		ResultSet rs = null;
		try {
			DatabaseMetaData dbMetData = conn.getMetaData();
			rs = null;
			if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
				rs = dbMetData.getTables(filter, null, pattern.toString()
						.replace("*", "%"), new String[] { "TABLE" });
			} else {
				rs = dbMetData.getTables(filter, filter, pattern.toString()
						.replace("*", "%"), new String[] { "TABLE" });
			}
			while (rs.next()) {
				if (rs.getString(4) != null
						&& (rs.getString(4).equalsIgnoreCase("TABLE"))) {
					Table table = new Table();
					if (cc.getConnectTypeEnum() == ConnectionType.MYSQL) {
						table.setDbName(rs.getString(1));
					} else {
						table.setDbName(rs.getString(2));
					}
					table.setTblName(rs.getString(3));
					if(cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL){
						if(!POSTGRESQLSYSTEMSCHEMA.contains(table.getDbName())){
							tblList.add(table);
						}
					}else{
						tblList.add(table);
					}
				}
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (conn != null) {
				conn.close();
			}
		}
		for (Table table : tblList) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("dbName", table.getDbName());
			map.put("tblName", table.getTblName());
			result.add(map);
		}
		for (String dataBase : dbLsit) {
			if (filter == null || filter.equalsIgnoreCase(dataBase)||cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("dbName", dataBase);
				map.put("tblName", "");
				result.add(map);
			}
		}
		// formate the result
		return formateDAT(result);
	}

	@SuppressWarnings("unchecked")
	private Map<Object, Object> formateDAT(List<Map<String, Object>> result) {
		try {
			Map<Object, Object> tmpHm = new HashMap<Object, Object>();
			for (Map<String, Object> map : result) {
				if (tmpHm.containsKey(map.get("dbName"))) {
					if (StringUtils.isNotBlank(map.get("tblName").toString())) {
						Map<Object, Object> tmp = (Map<Object, Object>) tmpHm
								.get(map.get("dbName"));
						tmp.put("count",
								Integer.parseInt(tmp.get("count").toString()) + 1);
						((ArrayList<Object>) tmp.get("data")).add(map);
					}
				} else {
					Map<Object, Object> tmp = new HashMap<Object, Object>();
					int count = 0;
					List<Object> list = new ArrayList<Object>();
					if (StringUtils.isNotBlank(map.get("tblName").toString())) {
						count++;
						list.add(map);
					}
					tmp.put("count", count);
					tmp.put("data", list);
					tmpHm.put(map.get("dbName"), tmp);
				}
			}
			// 对list中的表的名字进行排序，根据名字排序，展示上会好看些
			for (Entry<Object, Object> entry : tmpHm.entrySet()) {
				ArrayList<Object> list = (ArrayList<Object>) ((Map<Object, Object>) entry
						.getValue()).get("data");
				Collections.sort(
						list,
						(o1, o2) -> ((Map<String, Object>) o1)
								.get("tblName")
								.toString()
								.compareTo(
										((Map<String, Object>) o2).get(
												"tblName").toString()));
			}
			return tmpHm;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public List<String> getDatabase(CustomConnection cc) throws Exception {
		Connection conn = ConnUtil.getConnection(cc, null);
		if (conn == null) {
			return new ArrayList<String>();
		}
		String filter = getFilter(cc);
		try {
			return getDatabase(conn, filter, cc.getConnectTypeEnum());
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
	}

	private List<String> getDatabase(Connection conn, String filter,
			ConnectionType connectionType) throws Exception {
		List<String> dataBases = new ArrayList<String>();
		ResultSet rs = null;
		Statement stmt = null;
		try {
			StringBuffer sql = new StringBuffer();
			if (connectionType == ConnectionType.POSTGRESQL) {
				sql.append("SELECT schema_name FROM information_schema.schemata WHERE catalog_name");
			} else {
				sql.append("SHOW DATABASES ");
			}

			if (StringUtils.isNotBlank(filter)) {
				sql.append(" LIKE '").append(filter).append("'");
			}
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql.toString());
			while (rs.next()) {
				dataBases.add(rs.getString(1));
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
		}
		List<String> dataBases_prosgre = new ArrayList<String>();
		//去掉postgresql内置系统schema
		if (connectionType == ConnectionType.POSTGRESQL) {
			for (String db : dataBases) {
				if(!POSTGRESQLSYSTEMSCHEMA.contains(db)){
					dataBases_prosgre.add(db);
				}
			}
			return dataBases_prosgre;
		}
		return dataBases;
	}

	private String getFilter(CustomConnection cc) {
		String[] tmp = null;
		if (cc.getConnectTypeEnum() == ConnectionType.MYSQL) {
			tmp = cc.getConnectUrl().split("\\?")[0].replaceAll(
					"(?i)jdbc:mysql://", "").split("/");
		} else if (cc.getConnectTypeEnum() == ConnectionType.IMPALA) {
			tmp = cc.getConnectUrl().split(";")[0].replaceAll(
					"(?i)jdbc:hive2://", "").split("/");
		} else if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
			tmp = cc.getConnectUrl().split(";")[0].replaceAll(
					"(?i)jdbc:postgresql://", "").split("/");
		}
		if (tmp != null && tmp.length == 2 && StringUtils.isNotBlank(tmp[1])) {
			return tmp[1];
		} else {
			return null;
		}
	}

	@Override
	public List<String> getTables(String dbName, String tblName,
			CustomConnection cc) throws Exception {
		List<String> tables = new ArrayList<String>();
		Connection conn = ConnUtil.getConnection(cc, null);
		if (conn == null) {
			return tables;
		}
		ResultSet rs = null;
		Statement stmt = null;
		try {
			StringBuffer sql = new StringBuffer();
			if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
				sql.append("SELECT table_name FROM information_schema.tables WHERE table_schema = '").append(dbName).append("'");
			} else {
				sql.append("SHOW TABLES IN ").append(dbName);
			}

			if (StringUtils.isNotBlank(tblName)) {
				if (cc.getConnectTypeEnum() == ConnectionType.MYSQL) {
					sql.append(" LIKE '%").append(tblName).append("%'");
				} else if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
					sql.append(" AND table_name LIKE '%").append(tblName)
							.append("%'");
				} else {
					sql.append(" LIKE '*").append(tblName).append("*'");
				}
			}
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql.toString());
			while (rs.next()) {
				tables.add(rs.getString(1));
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		}
		return tables;
	}

	public static List<String> getPartitions(Param param) throws Exception {
		List<String> partitions = new ArrayList<String>();
		Connection conn = ConnUtil.getConnection(param.getCustomConnection(),
				null);
		if (conn == null) {
			return partitions;
		}
		String sql = "SHOW PARTITIONS " + param.getDbName() + "."
				+ param.getTblName();
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			while (rs.next()) {
				partitions.add(rs.getString(1));
			}
			return partitions;
		} catch (Exception e) {
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		}
		return partitions;
	}

	@Override
	public List<Column> getColumn(String DbName, String tblName,
			CustomConnection cc) throws Exception {
		Connection conn = ConnUtil.getConnection(cc, null);
		if (conn == null) {
			return new ArrayList<Column>();
		}
		StringBuffer sql = new StringBuffer();
		if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
			sql.append(
					"select column_name,data_type,column_default,is_nullable from  information_schema.columns where table_name = '")
					.append(tblName).append("';");
		} else {
			sql.append("DESCRIBE ").append(DbName).append(".").append(tblName);
		}
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql.toString());
			RowMapper<Column> rowMapper = null;
			if (cc.getConnectTypeEnum() == ConnectionType.MYSQL) {
				rowMapper = new MysqlColumnRowmapper();
			} else if (cc.getConnectTypeEnum() == ConnectionType.IMPALA) {
				rowMapper = new ImpalaColumnRowmapper();
			} else if (cc.getConnectTypeEnum() == ConnectionType.POSTGRESQL) {
				rowMapper = new PostgresqlColumnRowmapper();
			} else {
				rowMapper = new HiveColumnRowmapper();
			}
			ResultSetExtractor<List<Column>> extractor = new RowMapperResultSetExtractor<Column>(
					rowMapper);
			List<Column> cols = extractor.extractData(rs);
			return cols;
		} catch (Exception e) {
			logger.error(e, e);
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		}
		return null;
	}

	private class MysqlColumnRowmapper implements RowMapper<Column> {

		@Override
		public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
			MysqlColumn clo = new MysqlColumn();
			clo.setColName(rs.getString("Field"));
			clo.setColType(rs.getString("Type"));
			clo.setColKey(rs.getString("key"));
			clo.setColDefault(rs.getObject("Default"));
			clo.setColIsNull(rs.getString("Null"));
			clo.setColExtra(rs.getString("Extra"));
			return clo;
		}

	}

	private class ImpalaColumnRowmapper implements RowMapper<Column> {

		@Override
		public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
			Column clo = new Column();
			clo.setColName(rs.getString("name"));
			clo.setColType(rs.getString("type"));
			clo.setColComment(rs.getString("comment"));
			return clo;
		}

	}

	private class HiveColumnRowmapper implements RowMapper<Column> {

		@Override
		public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
			Column clo = new Column();
			clo.setColName(rs.getString("col_name"));
			clo.setColType(rs.getString("data_type"));
			clo.setColComment(rs.getString("comment"));
			return clo;
		}

	}

	private class PostgresqlColumnRowmapper implements RowMapper<Column> {

		@Override
		public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
			PostgresqlColumn clo = new PostgresqlColumn();
			clo.setColName(rs.getString("column_name"));
			clo.setColType(rs.getString("data_type"));
			clo.setColDefault(rs.getObject("column_default"));
			clo.setColIsNull(rs.getString("is_nullable"));
			return clo;
		}
	}

}
