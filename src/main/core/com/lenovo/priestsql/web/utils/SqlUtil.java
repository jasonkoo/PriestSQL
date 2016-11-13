package com.lenovo.priestsql.web.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.hive.ql.lib.Node;
import org.apache.hadoop.hive.ql.parse.ASTNode;
import org.apache.hadoop.hive.ql.parse.HiveParser;
import org.apache.hadoop.hive.ql.parse.ParseDriver;
import org.apache.hadoop.hive.ql.parse.ParseException;
import org.apache.hadoop.hive.ql.parse.ParseUtils;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.hql.HQL;
import com.lenovo.priestsql.hql.HQLParseResult;
import com.lenovo.priestsql.hql.HQLParser;
import com.lenovo.priestsql.web.dao.dataSource.DataSourceContextHolder;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.service.impl.ConnectionServiceImpl;

public class SqlUtil {

	private static final ParseDriver parseDriver = new ParseDriver();

	/**
	 * 为sql增加设置参数的前缀,并且为select语句增加limit限制
	 * 
	 * @param tid
	 *            任务id
	 * @param sql
	 *            要执行的sql
	 * @throws IOException
	 * @throws ParseException
	 */
	public static void setParam(Param param) throws Exception {
		String sql=null;
		boolean isFunction=false;
		HashMap<String, String> map = new HashMap<String, String>();
		if(isFunction=ifFunction(param.getSql().trim())){
			sql=param.getSql();
		}else{
			// 因为可能输入参数已经带set语句，所以要拆分处理其中的查询语句
			String _sql = preFomate(param.getSql(), map, "[\"\'](.*?)[\"\']");
			String[] sqls = _sql.split(";");
			for (int i = 0; i < sqls.length; i++) {
				// 判断是否是select语句,是否要创建临时表对数据进行保存
				if (sqls[i].trim().toLowerCase().startsWith("select")) {
					sqls[i] = addLimit(sqls[i], param);
				}
			}
			sql = arrayToString(sqls);
		}
		// 如果是hive或spark语句，增加额外的参数前缀
		if (param.getCustomConnection().getConnectTypeEnum() == ConnectionType.HIVE
				|| param.getCustomConnection().getConnectTypeEnum() == ConnectionType.SPARK) {
			String preFix = "";
			// 是否开启严格模式
			boolean strict = ContextServer
					.getInstance()
					.getConfig()
					.getBoolean(PriestSqlConfiguration.HIVE_STRICT,
							PriestSqlConfiguration.HIVE_STRICT_DEFAULT);
			if (strict) {
				preFix += "set hive.mapred.mode=strict;";
			}
			preFix += "set hive.fetch.task.conversion.threshold = 104857600;";

			sql = preFix + sql;
		}
		// 设置数据库名
		StringBuilder dbSql=new StringBuilder();
		if(isFunction){
			dbSql.append("CREAT_FUNCTION_SQL::");
		}
		if (param.getCustomConnection().getConnectTypeEnum() == ConnectionType.POSTGRESQL){
			if(StringUtils.isNotBlank(param.getDbName())&&!"public".equalsIgnoreCase(param.getDbName())){
				dbSql.append("SET search_path to ").append(param.getDbName()).append(",public;");
			}else{
				dbSql.append("SET search_path to public;");
			}
		}else{
			dbSql.append("use ").append(param.getDbName()).append(";");
		}
		sql = dbSql + sql;
		sql = afterFomate(sql, map);
		param.setSql(sql);

	}

	/**
	 * 为查询sql增加查询条数限制，如果已有限制且在1000条以下，则不做操作，大于1000的，改为1000
	 * 
	 * @param sql
	 * @return 处理后的sql
	 * @throws IOException
	 * @throws ParseException
	 */
	public static String addLimit(String sql, Param param) throws Exception {
		// 如果是简单查询或者mysql，impala，则直接加limit
		if (checkSimpleSql(sql, param)) {
			param.setCreatedTmpTable(false);
			boolean big = param.getForBigData() != 0;
			String regexLimit = "[\\s\\S]*\\s*(?i)limit\\s\\d+$";
			sql = sql.trim();
			int limit_Setting = ContextServer
					.getInstance()
					.getConfig()
					.getInt(PriestSqlConfiguration.QUERY_LIMIT,
							PriestSqlConfiguration.QUERY_LIMIT_DEFAULT);
			int limit_Setting_big = ContextServer
					.getInstance()
					.getConfig()
					.getInt(PriestSqlConfiguration.QUERY_LIMIT_BIG,
							PriestSqlConfiguration.QUERY_LIMIT_BIG_DEFAULT);
			if (sql.matches(regexLimit)) {
				String[] temp = sql.split("(?i)limit");
				int last = temp.length - 1;
				int limit = Integer.parseInt(temp[last].trim());
				sql = "";
				for (int i = 0; i < temp.length - 1; i++) {
					sql += " " + temp[i] + " limit ";
				}
				if (!big && limit > 1000) {
					sql += limit_Setting;
				} else if (big && limit > 100000) {
					sql += limit_Setting_big;
				} else {
					sql += limit;
				}
				return sql.trim();
			} else if (checkSimpleSql(sql)) {
				sql += " limit " + (big ? limit_Setting_big : limit_Setting);
				return sql;
			} else {
				String form = "SELECT * FROM (inputSql) hueFormTemp limit "
						+ (big ? limit_Setting_big : limit_Setting);
				sql = form.replace("inputSql", sql);
				return sql;
			}
		}
		// 如果是非简单表，则创建临时表
		else {
			param.setCreatedTmpTable(true);
			String preFix = "CREATE TABLE tmp.tmptable_"
					+ param.getQueryKey().toLowerCase()
					+ " STORED AS TEXTFILE  AS ";
			sql = preFix + sql;
			return sql;
		}
	}

	/**
	 * 检查是否是简单查询或者是mysql，impala查询
	 * 
	 * @param sql
	 * @return
	 * @throws IOException
	 * @throws ParseException
	 */
	private static boolean checkSimpleSql(String sql, Param param)
			throws Exception {
		ConnectionType connType = param.getCustomConnection()
				.getConnectTypeEnum();
		if (connType == ConnectionType.MYSQL
				|| connType == ConnectionType.IMPALA|| connType == ConnectionType.POSTGRESQL) {
			return true;
		}
		Set<String> tables = getTables(sql);
		if (tables.size() > 1) {
			return false;
		}
		String[] a = tables.toArray(new String[] {});
		String table = a[0];
		String[] dts = table.split("\\.");
		if (dts.length == 1) {
			param.setTblName(table);
		} else {
			param.setDbName(dts[0]);
			param.setTblName(dts[1]);
		}
		DataSourceContextHolder.setDataSourceType("hive");
		List<String> partitions = ConnectionServiceImpl.getPartitions(param);
		HQLParseResult hpr = HQLParser.parse(sql);
		Set<HQL> hqls = hpr.getHqls();
		boolean flag = true;
		for (HQL hql : hqls) {
			flag = hql.isSimpleQuery(partitions.toArray(new String[] {}));
		}
		return flag;
	}

	/**
	 * 检查是否是可以直接在sql后面加上limit的简单sql
	 * 
	 * @param sql
	 * @return
	 */
	private static boolean checkSimpleSql(String sql) {
		String regexSimpleSelectNoWhereNoAlias = "(?i)select\\s+[\\s\\S]+\\s+from\\s+\\S+";
		String regexSimpleSelectNoWhereWithAlias = "(?i)select\\s+[\\s\\S]+\\s+from\\s+\\S+\\s+\\S";
		String regexSimpleSelectWithWhereNoAlias = "(?i)select\\s+[\\s\\S]+\\s+from\\s+\\S+\\s+where\\s+[\\s\\S]+";
		String regexSimpleSelectWithWhereWithAlias = "(?i)select\\s+[\\s\\S]+\\s+from\\s+\\S+\\s+\\S+\\s+where\\s+[\\s\\S]+";
		String regexOrderByWithASC = "[\\s\\S]*\\s*(?i)order\\s+by\\s+\\S+\\s+\\S+";
		String regexOrderByNOASC = "[\\s\\S]*\\s*(?i)order\\s+by\\s+\\S+";

		String regexUnion = "[\\s\\S]+\\s+(?i)union\\s+[\\s\\S]+";
		if (sql.matches(regexSimpleSelectNoWhereNoAlias)) {
			return true;
		}
		if (sql.matches(regexSimpleSelectNoWhereWithAlias)) {
			return true;
		}
		if (!sql.matches(regexUnion)
				&& sql.matches(regexSimpleSelectWithWhereNoAlias)) {
			return true;
		}
		if (!sql.matches(regexUnion)
				&& sql.matches(regexSimpleSelectWithWhereWithAlias)) {
			return true;
		}
		if (sql.matches(regexOrderByWithASC)) {
			return true;
		}
		if (sql.matches(regexOrderByNOASC)) {
			return true;
		}
		return false;
	}

	/**
	 * 将字符串数组组合成字符串
	 * 
	 * @param strings
	 * @return
	 */
	public static String arrayToString(String[] strings) {
		StringBuffer sb = new StringBuffer();
		for (String string : strings) {
			sb.append(string);
			sb.append(";");
		}
		return sb.toString();
	}

	public static String preFomate(String sql, HashMap<String, String> map,
			String reg) {
		String _sql = sql;
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(sql);
		int count = 0;
		while (m.find()) {
			_sql = _sql.replace(m.group(), "TMP" + count + "__TMP");
			map.put("TMP" + count + "__TMP", m.group());
			count++;
		}
		return _sql;
	}

	public static String afterFomate(String sql, HashMap<String, String> map) {
		String _sql = sql;
		for (Entry<String, String> entry : map.entrySet()) {
			_sql = _sql.replace(entry.getKey(), entry.getValue());
		}
		return _sql;
	}

	/**
	 * 获取关键字在sql中的位置
	 * 
	 * @param sql
	 * @param keyWords
	 * @return
	 */
	public static int[] getLocation(String sql, String keyWords) {
		int line = 0;
		int column = 0;
		String[] lines = sql.split("\n");
		for (int i = 0; i < lines.length; i++) {
			if (lines[i].contains(keyWords)) {
				line = i + 1;
				column = lines[i].indexOf(keyWords);
			}
		}
		return new int[] { line, column };
	}

	public static List<String> getStringByReg(String srcString, String reg) {
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(srcString);
		List<String> result = new ArrayList<String>();
		while (m.find()) {
			result.add(m.group());
		}
		return result;
	}

	/**
	 * 返回sql中的表名和库名
	 * 
	 * @param param
	 * @return 库名和表名组成的数组
	 */
	public static List<String[]> getTables(Param param) {
		String _sql = param.getSql();
		HashMap<String, String> map = new HashMap<String, String>();
		_sql = preFomate(_sql, map, "[\"\'](.*?)[\"\']");
		String[] _sqls = _sql.split(";");
		Set<String> tables = new HashSet<String>();
		for (String sql : _sqls) {
			sql = afterFomate(sql, map);
			// 替换/以支持目录类型的字段名
			HashMap<String, String> map1 = new HashMap<String, String>();
			sql = preFomate(sql, map1, "`(.*?)`");
			try {
				tables.addAll(getTables(sql));
			} catch (Exception e) {
				List<String[]> exceptions = new ArrayList<String[]>();
				String[] exception = null;
				if (StringUtils.isNotBlank(e.getMessage())) {
					exception = new String[] { e.getMessage() };
				} else {
					exception = new String[] { "there is some errors in the sql,please check the sql!" };
				}
				exceptions.add(exception);
				return exceptions;
			}
		}
		// 为没有写库名的表加上选中的库的库名
		String defaultDb = param.getDbName();
		List<String[]> db_tables = new ArrayList<String[]>();
		for (String string : tables) {
			String[] dt = string.split("\\.");
			if (dt.length == 2) {
				db_tables.add(dt);
			} else if (dt.length == 1) {
				String[] dtt = { defaultDb, dt[0] };
				db_tables.add(dtt);
			}
		}
		return db_tables;

	}

	public static Set<String> getTables(String hiveSql) throws ParseException,
			IOException {
		parseDriver.parse(hiveSql);
		ASTNode tree = parseDriver.parse(hiveSql);
		ASTNode root = ParseUtils.findRootNonNullToken(tree);
		Set<String> tables = new HashSet<String>();
		getTables(root, tables);
		return tables;
	}

	/**
	 * 判断sql是否是创建存储过程
	 * @return
	 */
	public static boolean ifFunction(String sql){
		String regx="(?i)create\\s?[(or\\s?replace)]+\\s?(function|procedure)[\\s\\S]*";
		return sql.matches(regx)||sql.startsWith("CREAT_FUNCTION_SQL::");
	}
	
	private static void getTables(ASTNode node, Set<String> tables) {
		List<Node> children = node.getChildren();
		if (children != null) {
			for (Node child : children) {
				if (child.getChildren() != null
						&& ((ASTNode) node).getType() != HiveParser.TOK_SELEXPR) {
					getTables((ASTNode) child, tables);
				} else if (node.getType() == HiveParser.TOK_TABNAME) {
					int count = node.getChildCount();
					String table = count == 1 ? node.getChild(0).getText()
							: node.getChild(0).getText() + "."
									+ node.getChild(1).getText();
					tables.add(table);
					break;
				}
			}
		}
	}

}
