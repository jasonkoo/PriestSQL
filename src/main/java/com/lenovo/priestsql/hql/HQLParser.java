package com.lenovo.priestsql.hql;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.hadoop.hive.ql.lib.Node;
import org.apache.hadoop.hive.ql.parse.ASTNode;
import org.apache.hadoop.hive.ql.parse.HiveParser;
import org.apache.hadoop.hive.ql.parse.ParseDriver;
import org.apache.hadoop.hive.ql.parse.ParseException;
import org.apache.hadoop.hive.ql.parse.ParseUtils;

import com.google.common.base.Preconditions;
/**
 * 
 * @author luojiang2
 */
public final class HQLParser {
	private static final int flags = Pattern.CASE_INSENSITIVE | Pattern.MULTILINE;
	private static final Pattern SET_REGEX = Pattern.compile("set\\s+\\S+\\s*=\\s*\\S+",flags);
	private static final ThreadLocal<ParseDriver> LOCAL = new ThreadLocal<ParseDriver>(){
		@Override
		protected ParseDriver initialValue() {
			return new ParseDriver();
		}
	};
	
	/**
	 * Parse statement.
	 * @param statemnet	The statement includes multiple set statement and only one hql statement.
	 * @param partitionColumns	Partition columns
	 * @return
	 * @throws ParseException
	 * @throws IOException
	 */
	public static HQLParseResult parse(String statemnet) throws ParseException, IOException{
		Preconditions.checkArgument(statemnet != null,"Argument must not be null.");
		List<String> statements = parseStatement(statemnet);
		HQLParseResult result = new HQLParseResult(statemnet);
		classifyStatements(statements,result);
		for(HQL hql : result.getHqls()){
			ASTNode tree = LOCAL.get().parse(hql.getHql());
			ASTNode root = ParseUtils.findRootNonNullToken(tree);
			hql.setTree(root);
			hql.setTables(new HashSet<String>());
			getTables(root,hql.getTables());
			OperationType opType = root.getType() == HiveParser.TOK_QUERY ? OperationType.QUERY : OperationType.UNKNOWN;
			if(opType == OperationType.QUERY){
				traverseTree(root, hql);
				hql.setOpType(OperationType.QUERY);
			}else{
				hql.setOpType(getOperationType(hql.getHql(),root));
			}
		}
		return result;
	}

	/**
	 * Traverse tree
	 * @return
	 */
	private static void traverseTree(ASTNode root,HQL hql){
		List<ASTNode> dests = new ArrayList<ASTNode>();
		Set<String> whereColumns = new HashSet<String>();
		traverseTree(root, dests,whereColumns);
		hql.setDests(dests);
		hql.setWhereColumns(whereColumns);
	}
	
	private static void traverseTree(ASTNode parent,List<ASTNode> dests,Set<String> whereColumns){
		List<Node> children = parent.getChildren();
		if(children != null){
			for(Node child : children){
				ASTNode node = (ASTNode)child;
				if(node.getType() == HiveParser.TOK_TMP_FILE ||
				   node.getType() == HiveParser.TOK_DIR ||
				   node.getType() == HiveParser.TOK_LOCAL_DIR ||
				   node.getType() == HiveParser.TOK_TAB){
					dests.add(node);
				}else if(node.getType() == HiveParser.TOK_WHERE){
					traverseWhereCols(node,whereColumns);
				}else{
					traverseTree(node, dests,whereColumns);
				}
			}
		}
	}
	
	private static void traverseWhereCols(ASTNode parent,Set<String> whereColumns) {
		List<Node> children = parent.getChildren();
		if(children != null){
			for(Node child : children){
				ASTNode node = (ASTNode)child;
				if(node.getType() == HiveParser.TOK_TABLE_OR_COL){
					whereColumns.add(((ASTNode)node.getChildren().get(0)).getText());
				}else if(".".equals(node.getText())){
					whereColumns.add(((ASTNode)node.getChildren().get(1)).getText());
				}else{
					traverseWhereCols(node, whereColumns);
				}
			}
		}
	}
	
	private static OperationType getOperationType(String hql,ASTNode root){
		String upperKey = getUpperKey(hql);
		if(upperKey.startsWith("CREATE")){
			if(root.getType() == HiveParser.TOK_CREATETABLE){
				List<Node> children = root.getChildren();
				for(Node child : children){
					if(((ASTNode)child).getType() == HiveParser.TOK_QUERY){
						return OperationType.CREATE_TABLE_AS_QUERY;
					}
				}
				return OperationType.CREATE;
			}else{
				return OperationType.CREATE;
			}
		}else if(upperKey.startsWith("DROP")){
			return OperationType.DROP;
		}else if(upperKey.startsWith("ALTER")){
			return OperationType.ALTER;
		}else if(upperKey.startsWith("TRUNCATE")){
			return OperationType.TRUNCATE;
		}else if(upperKey.startsWith("SHOW")){
			return OperationType.SHOW;
		}else if(upperKey.startsWith("DESCRIBE") || upperKey.startsWith("DESC")){
			return OperationType.DESCRIBE;
		}else if(upperKey.startsWith("ANALYZE")){
			return OperationType.ANALYZE;
		}else if(upperKey.startsWith("LOAD")){
			return OperationType.LOAD;
		}else if(upperKey.startsWith("UPDATE")){
			return OperationType.UPDATE;
		}else if(upperKey.startsWith("DELETE")){
			return OperationType.DELETE;
		}else if(upperKey.startsWith("IMPORT")){
			return OperationType.IMPORT;
		}else if(upperKey.startsWith("EXPORT")){
			return OperationType.EXPORT;
		}else if(upperKey.startsWith("EXPLAIN")){
			return OperationType.EXPLAIN;
		}else{
			return OperationType.UNKNOWN;
		}
	}
	
	private static String getUpperKey(String hql) {
		int pos = 0;
		int length = hql.length();
		while(pos <= length){
			char c = hql.charAt(pos);
			if(c == ' ' || c == '\t' || c == '\n' || c == '\r'){
				break;
			}else{
				pos++;
			}
		}
		return hql.substring(0,pos).toUpperCase();
	}

	private static List<String> parseStatement(String hql){
		List<String> elements = new ArrayList<String>();
		int l = hql.length();
		int start = 0;
		int p = 0;
		char cur,pre = '\0',after='\0';
		while(p < l){
			if(p > 0){
				pre = hql.charAt(p-1);
			}
			cur = hql.charAt(p);
			if(p < l-1){
				after = hql.charAt(p+1);
			}
			if(cur == ';' && !((pre == '\'' || pre == '"') && (after == '\'' || after == '"'))){
				elements.add(hql.substring(start, p));
				start = p+1;
			}
			++p;
		}
		if(start < p){
			elements.add(hql.substring(start, p));
		}
		return elements;
	}

	private static void classifyStatements(List<String> statements,HQLParseResult result) {
		for(String statement : statements){
			String trim = statement.trim();
			if(SET_REGEX.matcher(trim).matches()){
				result.getSets().add(trim);
			}else{
				if(!trim.isEmpty()){
					HQL hql = new HQL(trim);
					result.getHqls().add(hql);
				}
			}
		}
	}
	
	private static void getTables(ASTNode node,Set<String> tables) {
		List<Node> children = node.getChildren();
		if(children != null){
			for(Node child : children){
				if(child.getChildren() != null && ((ASTNode)node).getType() != HiveParser.TOK_SELEXPR){
					getTables((ASTNode)child,tables);
				}else if(node.getType() == HiveParser.TOK_TABNAME){
					int count = node.getChildCount();
					String table = count == 1 ? node.getChild(0).getText() :
							node.getChild(0).getText()+"."+node.getChild(1).getText();
					tables.add(table); 
					break;
				}
			}
		}
	}
}