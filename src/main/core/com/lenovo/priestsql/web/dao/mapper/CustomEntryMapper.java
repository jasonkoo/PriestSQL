package com.lenovo.priestsql.web.dao.mapper;

import java.util.List;

import com.lenovo.priestsql.web.entity.CustomEntry;
import com.lenovo.priestsql.web.entity.Param;

public interface CustomEntryMapper extends Mapper<CustomEntry>{

	/**
	 * 查询所有的条目
	 * @param param
	 * @return
	 */
	public List<CustomEntry> getCustomEntryList(Param param);
	/**
	 * 查询所有的条目的条数
	 * @param param
	 * @return
	 */
	public int getCustomEntryListCount(Param param);
	
	/**
	 * 根据id查询次级条目
	 * @param param
	 * @return
	 */
	public List<CustomEntry> getCustomEntryById(Param param);
	/**
	 * 保存条目
	 * @param ce
	 * @return
	 */
	public int saveCustomEntry(CustomEntry ce);
	/**
	 * 更新条目
	 * @param ce
	 * @return
	 */
	public int updateCustomEntry(CustomEntry ce);
	/**
	 * 删除条目
	 * @param ce
	 * @return
	 */
	public int delCustomEntry(Param param);
}
