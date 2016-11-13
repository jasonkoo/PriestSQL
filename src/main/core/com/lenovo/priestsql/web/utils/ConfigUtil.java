package com.lenovo.priestsql.web.utils;

import java.util.Properties;

import org.apache.hadoop.conf.Configuration;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;

public class ConfigUtil extends PropertyPlaceholderConfigurer {
	
	protected void processProperties(
			ConfigurableListableBeanFactory beanFactoryToProcess,
			Properties props) throws BeansException {
		
		Configuration config = ContextServer.getInstance().getConfig();
		props.put(PriestSqlConfiguration.DATASOURCE_MAIN_DRIVER, config.get(PriestSqlConfiguration.DATASOURCE_MAIN_DRIVER, PriestSqlConfiguration.DATASOURCE_MAIN_DRIVER_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_MAIN_URL, config.get(PriestSqlConfiguration.DATASOURCE_MAIN_URL, PriestSqlConfiguration.DATASOURCE_MAIN_URL_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_MAIN_USERNAME, config.get(PriestSqlConfiguration.DATASOURCE_MAIN_USERNAME, PriestSqlConfiguration.DATASOURCE_MAIN_USERNAME_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_MAIN_PASSWORD, config.get(PriestSqlConfiguration.DATASOURCE_MAIN_PASSWORD, PriestSqlConfiguration.DATASOURCE_MAIN_PASSWORD_DEFAULT));
		
		props.put(PriestSqlConfiguration.DATASOURCE_LEAPID_DRIVER, config.get(PriestSqlConfiguration.DATASOURCE_LEAPID_DRIVER, PriestSqlConfiguration.DATASOURCE_LEAPID_DRIVER_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_LEAPID_URL, config.get(PriestSqlConfiguration.DATASOURCE_LEAPID_URL, PriestSqlConfiguration.DATASOURCE_LEAPID_URL_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_LEAPID_USERNAME, config.get(PriestSqlConfiguration.DATASOURCE_LEAPID_USERNAME, PriestSqlConfiguration.DATASOURCE_LEAPID_USERNAME_DEFAULT));
		props.put(PriestSqlConfiguration.DATASOURCE_LEAPID_PASSWORD, config.get(PriestSqlConfiguration.DATASOURCE_LEAPID_PASSWORD, PriestSqlConfiguration.DATASOURCE_LEAPID_PASSWORD_DEFAULT));
		
		super.processProperties(beanFactoryToProcess, props);
	}

	
}
