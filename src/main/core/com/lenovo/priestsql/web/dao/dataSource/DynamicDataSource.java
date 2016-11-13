package com.lenovo.priestsql.web.dao.dataSource;

import java.util.logging.Logger;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 动态切换数据源
 * 
 * @author liyi7
 */
public class DynamicDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSourceType();
    }

	public Logger getParentLogger() {
		return null;
	}
}
