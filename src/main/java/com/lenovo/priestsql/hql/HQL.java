package com.lenovo.priestsql.hql;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.hadoop.hive.ql.lib.Node;
import org.apache.hadoop.hive.ql.parse.ASTNode;
import org.apache.hadoop.hive.ql.parse.HiveParser;

public final class HQL {
	//Query hql
	private final String hql;
	//Abstract grammar tree
	private ASTNode tree;
	//Whether this sql is select statement.
	private OperationType opType;
	//Query tables
	private Set<String> tables;
	//Where conditions
	private Set<String> whereColumns;
	//Query destination
	private List<ASTNode> dests;
	
	public HQL(String hql) {
		this.hql = hql;
	}
	
	/**
	 * Whether the query needs to create temp file
	 * @return
	 */
	public boolean createTempFile(){
		if(dests != null){
			for(ASTNode node : dests){
				if(node.getType() == HiveParser.TOK_DIR){
					List<Node> children = node.getChildren();
					for(Node child : children){
						ASTNode n = (ASTNode)child;
						if(n.getType() == HiveParser.TOK_TMP_FILE)
							return true;
					}
				}
			}
		}
		return false;
	}
	
	/**
	 * Whether the query results are written to local directory
	 * @return
	 */
	public boolean writeToLocalDir(){
		if(dests != null){
			for(ASTNode node : dests){
				if(node.getType() == HiveParser.TOK_LOCAL_DIR){
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * Whether the sql is simple query
	 * @param partitionColumns
	 * @return
	 */
	public boolean isSimpleQuery(String[] partitionColumns) {
		if(opType == OperationType.QUERY && tables.size() == 1 ){
			List<ASTNode> nodes = new ArrayList<ASTNode>(1);
			traverseGroupOrOrderOrDistinct(this.tree,nodes);
			if(nodes.size() == 1){
				return false;
			}else if(whereColumns == null || whereColumns.size() == 0){
				return true;
			}else{
				if(partitionColumns == null || whereColumns.size() != partitionColumns.length){
					return false;
				}else{
					for(String wc : whereColumns){
						int length = partitionColumns.length;
						for(int i = 0 ; i < length ; i++){
							if(partitionColumns[i].equals(wc)){
								break;
							}
							if(i == length-1){
								return false;
							}
						}
					}
					return  true;
				}
			}
		}else{
			return false;
		}
	}

	private void traverseGroupOrOrderOrDistinct(ASTNode root,List<ASTNode> nodes) {
		if(root.getType() == HiveParser.TOK_GROUPBY ||
		   root.getType() == HiveParser.TOK_ORDERBY ||
		   root.getType() == HiveParser.TOK_SELECTDI){
			nodes.add(root);
			return;
		}else{
			List<Node> children = root.getChildren();
			if(children != null){
				for(Node child : children){
					traverseGroupOrOrderOrDistinct((ASTNode)child,nodes);
				}
			}
		}
		
	}

	/**
	 * Asynchronous execution hql
	 * @return
	 */
	public boolean asyncExecuteHql(boolean isSimpleQuery){
		return !(opType == OperationType.SHOW || 
				 opType == OperationType.DESCRIBE ||
				 opType == OperationType.EXPLAIN ||
				 opType == OperationType.ANALYZE ||
				 opType == OperationType.DROP ||
				 opType == OperationType.TRUNCATE ||
				 opType == OperationType.CREATE);
	}
	
	public String getHql() {
		return hql;
	}
	public ASTNode getTree() {
		return tree;
	}

	public void setTree(ASTNode tree) {
		this.tree = tree;
	}

	public OperationType getOpType() {
		return opType;
	}
	public void setOpType(OperationType opType) {
		this.opType = opType;
	}
	public Set<String> getTables() {
		return tables;
	}
	public void setTables(Set<String> tables) {
		this.tables = tables;
	}
	public Set<String> getWhereColumns() {
		return whereColumns;
	}

	public void setWhereColumns(Set<String> whereColumns) {
		this.whereColumns = whereColumns;
	}

	public List<ASTNode> getDests() {
		return dests;
	}

	public void setDests(List<ASTNode> dests) {
		this.dests = dests;
	}

	@Override
	public int hashCode() {
		return this.hql.hashCode();
	}
	@Override
	public String toString() {
		return this.hql;
	}
}