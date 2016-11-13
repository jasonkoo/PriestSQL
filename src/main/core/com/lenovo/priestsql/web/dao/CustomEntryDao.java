package com.lenovo.priestsql.web.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lenovo.priestsql.web.dao.mapper.CustomEntryMapper;
import com.lenovo.priestsql.web.entity.CustomEntry;
import com.lenovo.priestsql.web.entity.Param;

@Repository
public class CustomEntryDao {

	@Autowired
	private CustomEntryMapper cem;
	
	
	/**
	 * 查询所有的条目
	 * @param param
	 * @return
	 */
	public List<CustomEntry> getCustomEntryList(Param param){
		return cem.getCustomEntryList(param);
	}
	/**
	 * 查询所有的条目的条数
	 * @param param
	 * @return
	 */
	public int getCustomEntryListCount(Param param){
		return cem.getCustomEntryListCount(param);
	}
	/**
	 * 根据id查询次级条目
	 * @param param
	 * @return
	 */
	public List<CustomEntry> getCustomEntryById(Param param){
		return cem.getCustomEntryById(param);
	}
	/**
	 * 保存条目
	 * @param ce
	 * @return
	 */
	@Transactional
	public int saveCustomEntry(CustomEntry ce){
		return cem.saveCustomEntry(ce);
	}
	/**
	 * 更新条目
	 * @param ce
	 * @return
	 */
	@Transactional
	public int updateCustomEntry(CustomEntry ce){
		return cem.updateCustomEntry(ce);
	}
	/**
	 * 删除条目
	 * @param ce
	 * @return
	 */
	@Transactional
	public int delCustomEntry(Param param){
		return cem.delCustomEntry(param);
	}
}
