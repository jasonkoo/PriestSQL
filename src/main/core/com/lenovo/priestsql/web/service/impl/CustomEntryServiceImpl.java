package com.lenovo.priestsql.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovo.priestsql.web.dao.CustomEntryDao;
import com.lenovo.priestsql.web.dao.dataSource.DataSourceContextHolder;
import com.lenovo.priestsql.web.entity.CustomEntry;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.service.CustomEntryService;

@Service
public class CustomEntryServiceImpl implements CustomEntryService {

	@Autowired
	private CustomEntryDao ced;
	
	public List<CustomEntry> getCustomEntryList(Param param) {
		DataSourceContextHolder.setDataSourceType("main");
		return ced.getCustomEntryList(param);
	}
	public int getCustomEntryListCount(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return ced.getCustomEntryListCount(param);
	}
	public List<CustomEntry> getCustomEntryById(Param param){
		DataSourceContextHolder.setDataSourceType("main");
		return ced.getCustomEntryById(param);
	}
	public int saveCustomEntry(CustomEntry ce) {
		DataSourceContextHolder.setDataSourceType("main");
		return ced.saveCustomEntry(ce);
	}
	public int updateCustomEntry(CustomEntry ce){
		DataSourceContextHolder.setDataSourceType("main");
		return ced.updateCustomEntry(ce);
	}
	public int delCustomEntry(Param param) {
		DataSourceContextHolder.setDataSourceType("main");
		return ced.delCustomEntry(param);
	}

}
