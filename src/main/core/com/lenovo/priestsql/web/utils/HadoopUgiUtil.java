/**
 * 
 */
package com.lenovo.priestsql.web.utils;

import java.io.IOException;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.security.UserGroupInformation;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.factory.ConfigurationFactory;
/**
 * 
 * @author zhouyu16
 *
 */
public class HadoopUgiUtil {

	static Configuration conf =ConfigurationFactory.getConfiguration();
	static boolean  kerberosEnabled =ContextServer
			.getInstance()
			.getConfig()
			.getBoolean(PriestSqlConfiguration.KERBEROS_AUTH_ENABLED,
					PriestSqlConfiguration.KERBEROS_AUTH_ENABLED_DEFAULT);
	
	public enum KerberosType {
		QUERY, FILE
	}

	public static void kerberosLogin(KerberosType type) throws IOException {
		if (kerberosEnabled) {
			String[] name_path = getNamePath(type);
			if (name_path == null) {
				return;
			}
			conf.set("hadoop.security.authentication", "kerberos");
			UserGroupInformation.setConfiguration(conf);
			UserGroupInformation
					.loginUserFromKeytab(name_path[0], name_path[1]);
		}
	}

	public static UserGroupInformation kerberosLoginReturnUser(
			KerberosType type, String proxyUser) throws IOException {
		if (kerberosEnabled) {
			String[] name_path = getNamePath(type);
			if (name_path == null) {
				return null;
			}
			conf.set("hadoop.security.authentication", "kerberos");
			UserGroupInformation.setConfiguration(conf);
			UserGroupInformation
					.loginUserFromKeytab(name_path[0], name_path[1]);
			//获取当前认证用户，如果不通过代理的方式，则可以用这个方法
			/*UserGroupInformation userGroup = UserGroupInformation
					.getCurrentUser();*/
			UserGroupInformation userGroup = null;
			if (StringUtils.isNotBlank(proxyUser)) {
				userGroup = UserGroupInformation.createProxyUser(proxyUser,
						userGroup);
			}
			return userGroup;
		} else {
			return null;
		}
	}

	private static String[] getNamePath(KerberosType type) {
		String kerberosUserName = "";
		String keytabFullPath = "";
		if (KerberosType.QUERY == type) {
			kerberosUserName = ContextServer
					.getInstance()
					.getConfig()
					.get(PriestSqlConfiguration.KERBEROS_REALM_QUERY,
							PriestSqlConfiguration.KERBEROS_REALM_QUERY_DEFAULT);
			keytabFullPath = ContextServer
					.getInstance()
					.getConfig()
					.get(PriestSqlConfiguration.KERBEROS_KEYTAB_FILEPATH_QUERY,
							PriestSqlConfiguration.KERBEROS_KEYTAB_FILEPATH_QUERY_DEFAULT);
		}else if (KerberosType.FILE == type) {
			kerberosUserName = ContextServer
					.getInstance()
					.getConfig()
					.get(PriestSqlConfiguration.KERBEROS_REALM_FILE,
							PriestSqlConfiguration.KERBEROS_REALM_FILE_DEFAULT);
			keytabFullPath = ContextServer
					.getInstance()
					.getConfig()
					.get(PriestSqlConfiguration.KERBEROS_KEYTAB_FILEPATH_FILE,
							PriestSqlConfiguration.KERBEROS_KEYTAB_FILEPATH_FILE_DEFAULT);
		} else {
			return null;
		}
		return new String[] { kerberosUserName, keytabFullPath };
	}
}
