package com.lenovo.priestsql.web.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;

public class ObjectUtil {

	private static Logger logger=Logger.getLogger(ObjectUtil.class);
	
	public static List<String> getFields(Object obj){
		Field[] fd=obj.getClass().getDeclaredFields();
		List<String> fieldsName=new ArrayList<String>();
		for (Field field : fd) {
			field.setAccessible(true);
			fieldsName.add(field.getName());
		}
		logger.error(JSONObject.toJSONString(fd));
		logger.error(JSONObject.toJSONString(fieldsName));
		return fieldsName;
	}
	
	public static Object getValue(Object obj,String fieldName){
		try {
			Field fd=obj.getClass().getField(fieldName);
			return fd.get(obj);
		} catch (Exception e) {
			logger.error(e,e);
			return null;
		} 
	}
}
