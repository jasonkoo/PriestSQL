package com.lenovo.priestsql.hql;

import java.util.HashSet;
import java.util.Set;

public final class HQLParseResult {
	private final String originalStatement;
	private final Set<String> sets = new HashSet<String>();
	private final Set<HQL> hqls = new HashSet<HQL>();
	
	public HQLParseResult(String originalStatement) {
		this.originalStatement = originalStatement;
	}
	public String getOriginalStatement() {
		return originalStatement;
	}
	public Set<String> getSets() {
		return sets;
	}
	public Set<HQL> getHqls() {
		return hqls;
	}
}