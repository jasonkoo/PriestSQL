package com.lenovo.priestsql.web.factory;

import java.net.URI;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;

public class FileSystemFactory {

	
	static final Configuration conf = ConfigurationFactory.getConfiguration();
	
	static final boolean useConfiguration =ContextServer
			.getInstance()
			.getConfig()
			.getBoolean(PriestSqlConfiguration.USE_HADOOP_CONFIGURATION,
					PriestSqlConfiguration.USE_HADOOP_CONFIGURATION_DEFAULT);
	//如果有配置文件，这其实是不需要的
	static String root = ContextServer
			.getInstance()
			.getConfig()
			.get(PriestSqlConfiguration.HDFS_ROOT_URI,
					PriestSqlConfiguration.HDFS_ROOT_URI_DEFAULT);
	
	public static FileSystem getFileSystem() throws Exception{
		if(useConfiguration){
			return FileSystem.newInstance(conf);
		}else{
			return FileSystem.newInstance(new URI(root), conf);
		}
	}
	
}
