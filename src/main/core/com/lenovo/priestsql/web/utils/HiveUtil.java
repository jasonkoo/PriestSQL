package com.lenovo.priestsql.web.utils;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.PrivilegedExceptionAction;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.security.UserGroupInformation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lenovo.priestsql.web.utils.HadoopUgiUtil.KerberosType;



/**
 * @author yuehan1
 * @date 2016年5月16日
 */
public class HiveUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(HiveUtil.class);

	public static void load2Hive(String hdfsFile, String tableName, String patition, boolean overrite,String proxyUser)
			throws FileNotFoundException, IOException, SQLException, InterruptedException {
		StringBuilder sqlBuffer = new StringBuilder();
		sqlBuffer.append("LOAD DATA INPATH ").append("'").append(hdfsFile).append("'");
		if (overrite) {
			sqlBuffer.append(" OVERWRITE ");
		}
		sqlBuffer.append("INTO TABLE ").append(tableName);
		if (StringUtils.isNotBlank(patition)) {
			sqlBuffer.append(" PARTITION(").append(patition).append(")");
		}
		Connection connection = null;
		try {
			UserGroupInformation ugif = HadoopUgiUtil.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
			connection = getConnection(proxyUser);
			final Statement statement = connection.createStatement();
			final String hiveSQL = sqlBuffer.toString();
			LOGGER.error("start execute sql= " + hiveSQL);
			ugif.doAs(new PrivilegedExceptionAction<Object>() {
				@Override
				public Object run() throws SQLException {
					return statement.execute(hiveSQL);
				}
			});
		} finally {
			close(connection);
		}
	}

	private static Connection getConnection(String proxyUser) {
		/*String driver = "org.apache.hive.jdbc.HiveDriver";
		String url = ConfigUtil.getContextProperty("hiveconn.url") + proxyUser;
		Connection connection = null;
		try {
			Class.forName(driver);
			connection = DriverManager.getConnection(url);
		} catch (ClassNotFoundException e) {
			LOGGER.error("ClassNotFoundException", e);
		} catch (SQLException e) {
			LOGGER.error("SQLException", e);
		}
		return connection;*/
		//TODO 
		return null;
	}

	private static void close(Connection connection) {
		if (connection != null) {
			try {
				connection.close();
			} catch (SQLException e) {
				LOGGER.error("SQLException", e);
			}
		}
	}

}
