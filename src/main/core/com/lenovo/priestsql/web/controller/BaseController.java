package com.lenovo.priestsql.web.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.lenovo.priestsql.web.entity.Page;

/**
 * controller基础类
 * 
 * @author yuehan1
 * @date 2014年11月28日
 */
public class BaseController {

	
	/**
	 * 内存排序
	 * 
	 * @param list
	 * @param sortOrderBy
	 * @param sortRule
	 */
	public void memorySort(List<JSONObject> list, final String sortOrderBy, final String sortRule) {
		if (StringUtils.isNotBlank(sortOrderBy)) {
			Collections.sort(list, new Comparator<JSONObject>() {
				public int compare(JSONObject o1, JSONObject o2) {
					if (o1.get(sortOrderBy) instanceof String) {
						if ("asc".equalsIgnoreCase(sortRule))
							return o1.getString(sortOrderBy).compareTo(o2.getString(sortOrderBy));
						else
							return o2.getString(sortOrderBy).compareTo(o1.getString(sortOrderBy));
					} else {
						if ("asc".equalsIgnoreCase(sortRule))
							return o1.getDoubleValue(sortOrderBy) - o2.getDoubleValue(sortOrderBy)>0?1:-1;
						else
							return o2.getDoubleValue(sortOrderBy) - o1.getDoubleValue(sortOrderBy)>0?1:-1;
					}
				}
			});
		}
	}
	public void memorySortForMap(List<Map<String,Object>> list, final String sortOrderBy, final String sortRule) {
		if (StringUtils.isNotBlank(sortOrderBy)) {
			Collections.sort(list, new Comparator<Map<String,Object>>() {
				public int compare(Map<String,Object> o1, Map<String,Object> o2) {
					if (o1.get(sortOrderBy) instanceof String) {
						if ("asc".equalsIgnoreCase(sortRule))
							return String.valueOf(o1.get(sortOrderBy)).compareTo(String.valueOf(o2.get(sortOrderBy)));
						else
							return String.valueOf(o2.get(sortOrderBy)).compareTo(String.valueOf(o1.get(sortOrderBy)));
					} else {
						double do1=Double.parseDouble(String.valueOf(o1.get(sortOrderBy)));
						double do2=Double.parseDouble(String.valueOf(o2.get(sortOrderBy)));
						if ("asc".equalsIgnoreCase(sortRule))
							return do1 - do2>0?1:-1;
						else
							return do2 - do1>0?1:-1;
					}
				}
			});
		}
	}
	/**
	 * 内存分页
	 * 
	 * @param list
	 *            数据列表
	 * @param pageIndex
	 *            页码，下标从1开始
	 * @param pageSize
	 *            每页大小
	 * @return page对象
	 */
	public <T> Page<T> memoryPage(List<T> list, int pageIndex, int pageSize) {
		// 表格数据
		List<T> rows = new ArrayList<T>();
		int startIndex = (pageIndex - 1) * pageSize;
		for (int i = startIndex; i < list.size(); i++) {
			rows.add(list.get(i));
			if (i == startIndex + pageSize - 1) {
				break;
			}
		}
		Page<T> page = new Page<T>();
		page.setRows(rows);
		page.setPageIndex(pageIndex);
		page.setTotal(list.size());
		return page;
	}

	
}
