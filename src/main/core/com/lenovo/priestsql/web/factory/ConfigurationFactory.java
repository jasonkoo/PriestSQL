package com.lenovo.priestsql.web.factory;

import org.apache.hadoop.conf.Configuration;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;

public class ConfigurationFactory {

	static final boolean useConfiguration = ContextServer
			.getInstance()
			.getConfig()
			.getBoolean(PriestSqlConfiguration.USE_HADOOP_CONFIGURATION,
					PriestSqlConfiguration.USE_HADOOP_CONFIGURATION_DEFAULT);

	public static Configuration getConfiguration() {
		Configuration conf = new Configuration();
		Configuration psc= ContextServer.getInstance().getConfig();
		if (useConfiguration) {
			conf.addResource(psc.get(PriestSqlConfiguration.HADOOP_CORE_SITE, PriestSqlConfiguration.HADOOP_CORE_SITE_DEFAULT));
			conf.addResource(psc.get(PriestSqlConfiguration.HADOOP_HDFS_SITE, PriestSqlConfiguration.HADOOP_HDFS_SITE_DEFAULT));
		}
		return conf;
	}

}
