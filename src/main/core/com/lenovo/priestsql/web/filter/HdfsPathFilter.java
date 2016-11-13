package com.lenovo.priestsql.web.filter;

import java.util.List;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.PathFilter;

public class HdfsPathFilter implements PathFilter {
	
	/**
	 * 过滤条件
	 */
	private List<String> filters;
	/**
	 * 正则过滤条件
	 */
	private String reg;
	/**
	 * 是否正则过滤
	 */
	private boolean isReg;
	
	

	public HdfsPathFilter(List<String> filters) {
		super();
		this.filters = filters;
		this.isReg=false;
	}
	
	public HdfsPathFilter(String reg) {
		super();
		this.reg = reg;
		this.isReg=true;
	}


	@Override
	public boolean accept(Path paramPath) {
		if(isReg){
			if(paramPath.getName().matches(reg)){
				return true;
			}
			return false;
		}else{
			if(filters.contains(paramPath.getName())){
				return true;
			}
			return false;
		}
	}

	public List<String> getFilters() {
		return filters;
	}


	public void setFilters(List<String> filters) {
		this.filters = filters;
	}

	
	public String getReg() {
		return reg;
	}


	public void setReg(String reg) {
		this.reg = reg;
	}


	public boolean isReg() {
		return isReg;
	}


	public void setReg(boolean isReg) {
		this.isReg = isReg;
	}



}
