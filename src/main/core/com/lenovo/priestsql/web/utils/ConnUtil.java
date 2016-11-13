package com.lenovo.priestsql.web.utils;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.lang3.StringUtils;

import com.lenovo.priestsql.datasource.ConnectionPoolConfig;
import com.lenovo.priestsql.datasource.PooledDataSource;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.utils.HadoopUgiUtil.KerberosType;

public class ConnUtil {
	private static final HashMap<String, PooledDataSource> dataSources=new HashMap<String, PooledDataSource>();
	private static final ReentrantLock lock = new ReentrantLock();
	public static Connection getConnection(CustomConnection cc,String proxyUser) throws IOException, SQLException{
		if(cc.getConnectTypeEnum()!=ConnectionType.MYSQL){
			//kerberos认证
			HadoopUgiUtil.kerberosLogin(KerberosType.QUERY);
		}
		String key=Md5Util.MD5(cc.getConnectUrl());
		lock.lock();
		try{
			//Not exists,create a PooledDataSource
			if(dataSources.get(key)==null){
				ConnectionPoolConfig ccc=new ConnectionPoolConfig();
				ccc.setDriver(cc.getConnectDriver());
				ccc.setUrl(cc.getConnectUrl());
				ccc.setUsername(cc.getConnectUser());
				ccc.setPassword(cc.getConnectPwd());
				ccc.setMaxConnectionCount(50);
				PooledDataSource pds=new PooledDataSource(ccc);
				dataSources.put(key, pds);
			}
		}finally{
			lock.unlock();
		}
		PooledDataSource pooldatasource=dataSources.get(key);
		if(StringUtils.isNotBlank(proxyUser)){
			pooldatasource.setHiveServer2ProxyUser(proxyUser);
		}
		return pooldatasource.getConnection();
	}
}