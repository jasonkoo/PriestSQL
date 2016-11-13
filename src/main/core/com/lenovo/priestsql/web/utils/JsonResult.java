package com.lenovo.priestsql.web.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

/**
 * @author yuehan1
 * @date 2015年3月11日
 */
public class JsonResult {

	private int code = ResponseCode.SUCCESS;
	private String errorMessage;
	private Object data;
	private int queryIndex;

	public JsonResult() {
	}
	
	public JsonResult(Object data) {
		this.data = data;
	}

	public JsonResult(Object data,int queryIndex) {
		this.data = data;
		if(queryIndex!=-1){
			this.queryIndex=queryIndex;
		}
	}
	/**
	 * 
	 * @param code 返回代码
	 * @param data 返回内容
	 * @param queryIndex 如果为查询部分，则需要带上queryIdex
	 */
	public JsonResult(int code, Object data,int queryIndex) {
		this.code = code;
		if(code<=0){
			this.errorMessage = formateException(data.toString());
		}else{
			this.data = data;
		}
		if(queryIndex!=-1){
			this.queryIndex=queryIndex;
		}
	}
	
	public JsonResult(int code, Object data) {
		this.code = code;
		if(code<=0){
			this.errorMessage = formateException(data);
		}else{
			this.data = data;
		}
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public int getQueryIndex() {
		return queryIndex;
	}

	public void setQueryIndex(int queryIndex) {
		this.queryIndex = queryIndex;
	}

	@Override
	public String toString() {
		return JSON.toJSONString(this,SerializerFeature.WriteMapNullValue);
	}
	
	public String formateException(Object excption){
		if(excption==null){
			return "NullPointer";
		}
		if(excption.toString().contains("Permission denied")){
			return "Permission denied";
		}else if(excption.toString().contains("timed out")){
			return "Timed out";
		}else if(excption.toString().contains("Duplicate entry")){
			return "Duplicate key";
		}else{
			return excption.toString();
		}
	}
}
