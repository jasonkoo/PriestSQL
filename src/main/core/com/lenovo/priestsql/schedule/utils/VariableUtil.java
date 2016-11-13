package com.lenovo.priestsql.schedule.utils;

import com.lenovo.priestsql.web.exception.PriestsqlHueArgumentException;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * Query variables tool class
 * @author luojiang2
 */
public final class VariableUtil {
	private static final ThreadLocal<Pattern> VAR_PATTERN = new ThreadLocal<Pattern>(){
		@Override
		protected Pattern initialValue() {
			return Pattern.compile("\\$\\{[^\\$\\{\\}]+\\}");
		}
	};
	
	private static final ThreadLocal<Pattern> BUILTIN_VAR_PATTERN = new ThreadLocal<Pattern>(){
		@Override
		protected Pattern initialValue() {
			return Pattern.compile("(\\$\\{today\\})\\s*(\\+|\\-)?\\s*(0|[1-9]+[0-9]*)?");
		}
	};
	
	/**
	 * Check variables in hql.
	 * If there are non-replaceable variables, will throw an exception.
	 * @return
	 * @throws RuntimeException
	 */
	public static void checkVariables(String hql,String variables) throws RuntimeException{
		Set<String> varsInHql = getVarsInHql(hql);
		if(varsInHql.size() == 0){
			return;
		}else if(variables == null || variables.trim().isEmpty()){
			throw new PriestsqlHueArgumentException(getMessage(varsInHql));
		}else{
			Map<String,String> varsExpr = getVarsExpr(variables,true);
			varsInHql.removeAll(varsExpr.keySet());
			if(varsInHql.size() > 0){
				throw new PriestsqlHueArgumentException(getMessage(varsInHql));
			}
		}
	}

	/**
	 * Replace variables in hql.
	 * @param hql
	 * @param variables
	 */
	public static String replaceVariables(String hql,String variables){
		if(variables == null || variables.trim().isEmpty()){
			return hql;
		}
		Set<String> varsInHql = getVarsInHql(hql);
		Map<String,String> varsExpr = getVarsExpr(variables, false);
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		for(String var : varsInHql){
			String builtInVar = varsExpr.get(var);
			try {
				// Handle built-in variables for the date.
				String[] elements = getBuiltInVarElements(builtInVar);
				if("-".equals(elements[1])){
					calendar.add(Calendar.DAY_OF_YEAR,-Integer.parseInt(elements[2]));
				} else if ("+".equals(elements[1])){
					calendar.add(Calendar.DAY_OF_YEAR,Integer.parseInt(elements[2]));
				}
				hql = hql.replace(var, sdf.format(calendar.getTime()));
			} catch (RuntimeException e) {
				// Others variables
				hql = hql.replace(var, builtInVar);
			}
		}
		return hql;
	}
	
	private static String getMessage(Set<String> varsInHql) {
		StringBuilder sb = new StringBuilder();
		varsInHql.forEach(item -> sb.append(item).append(","));
		return "["+sb.deleteCharAt(sb.length()-1).toString()+"] variables can not be replaced.";
	}

	private static Set<String> getVarsInHql(String hql) {
		Set<String> varsInHql = new HashSet<String>();
		Matcher matcher = VAR_PATTERN.get().matcher(hql);
		while(matcher.find()){
			varsInHql.add(matcher.group().trim());
		}
		return varsInHql;
	}

	private static Map<String, String> getVarsExpr(String variables,boolean checkBuiltInVariables) {
		Map<String,String> varsExpr = new HashMap<String,String>();
		String[] kvs = variables.split("\\,");
		for(String kv : kvs){
			String[] _kv = kv.split("\\=",2);
			if(_kv.length == 2){
				if(checkBuiltInVariables){
					checkBuiltInVar(_kv[1].trim());
				}
				varsExpr.put(_kv[0].trim(), _kv[1].trim());
			}
		}
		return varsExpr;
	}
	
	
	private static void checkBuiltInVar(String builtInVariable) {
		Matcher matcher = BUILTIN_VAR_PATTERN.get().matcher(builtInVariable);
		if(!matcher.matches()){
			throw new RuntimeException("Can't recognize the built-in variable ["+builtInVariable+"]");
		}
	}
	
	private static String[] getBuiltInVarElements(String builtInVariable){
		checkBuiltInVar(builtInVariable);
		String[] elements = new String[3];
		Matcher matcher = BUILTIN_VAR_PATTERN.get().matcher(builtInVariable);
		if(!matcher.matches()){
			throw new RuntimeException("Can't recognize the built-in variable ["+builtInVariable+"]");
		}else{
			elements[0] = matcher.group(1);
			elements[1] = matcher.group(2);
			elements[2] = matcher.group(3);
			return elements;
		}
	}

	public static void main(String[] args) {
		String hql = "create table testing as select * from a where a.startDate > ${date} and a.name != ${userName}";
		String resultHQL = replaceVariables(hql, "${date}=${today}, ${userName}='zhangsan'");
		System.err.println(resultHQL);
	}
}
