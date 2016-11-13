package com.lenovo.priestsql.web.entity;

import java.util.List;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * @author yuehan1
 * @date 2015年1月15日
 * @param <T>
 */
public class Page<T> {

	private Integer total;

	private List<T> rows;
	
	private List<String> header;
	
	@JSONField(name = "page")
	private Integer pageIndex;

	public List<T> getRows() {
		return rows;
	}

	public void setRows(List<T> rows) {
		this.rows = rows;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}
	
	public Integer getPageIndex() {
		return pageIndex;
	}
	
	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}

	public List<String> getHeader() {
		return header;
	}

	public void setHeader(List<String> header) {
		this.header = header;
	}
}
