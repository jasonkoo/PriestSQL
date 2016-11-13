package com.lenovo.priestsql.web.utils;

import org.hibernate.jdbc.util.FormatStyle;

public class PrettySQLFormatter {

	/**
	 * 获取漂亮的SQL语句 韦向阳
	 * 
	 * @since 2011-05-27
	 * @param sql
	 *            SQL语句
	 */
	public static String getPerttySql(String sql) {
		return FormatStyle.BASIC.getFormatter().format(sql);
	}

	/**
	 * 获取漂亮的SQL语句 韦向阳
	 * 
	 * @since 2011-05-27
	 * @param remark
	 *            打印前的说明信息
	 * @param sql
	 *            SQL语句
	 */
	public static String getPerttySql(String remark, String sql) {
		return remark + FormatStyle.BASIC.getFormatter().format(sql);
	}
	
}
