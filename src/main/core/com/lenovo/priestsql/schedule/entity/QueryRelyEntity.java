package com.lenovo.priestsql.schedule.entity;

/**
 *	Query relation entity
 */
public final class QueryRelyEntity {
	//Query id
	private int queryId;
	//Rely query id
	private int relyQueryId;
	//Rely query result variable
	private String relyQueryResultVariable;
	//Query execution condition
	private String condition;
	
	public int getQueryId() {
		return queryId;
	}
	public void setQueryId(int queryId) {
		this.queryId = queryId;
	}
	public int getRelyQueryId() {
		return relyQueryId;
	}
	public void setRelyQueryId(int relyQueryId) {
		this.relyQueryId = relyQueryId;
	}
	public String getRelyQueryResultVariable() {
		return relyQueryResultVariable;
	}
	public void setRelyQueryResultVariable(String relyQueryResultVariable) {
		this.relyQueryResultVariable = relyQueryResultVariable;
	}
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
}