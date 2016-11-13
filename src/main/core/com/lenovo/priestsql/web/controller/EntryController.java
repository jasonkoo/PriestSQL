package com.lenovo.priestsql.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.entity.Column;
import com.lenovo.priestsql.web.entity.CustomConnection;
import com.lenovo.priestsql.web.entity.CustomEntry;
import com.lenovo.priestsql.web.entity.Page;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.service.CustomEntryService;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.ResponseCode;

@RestController
@RequestMapping("entry")
public class EntryController {

	Logger logger =Logger.getLogger(EntryController.class);
	
	@Autowired
	private CustomEntryService ces;
	@Autowired
	private ConnectionService cs;
	
	/**
	 * 查询用户的关联数据库
	 * @param param
	 * @return
	 */
	@RequestMapping("getDataBases")
	public Object getDataBases(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			List<String> dbs=cs.getDatabase(cc);
			return new JsonResult(dbs);
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
		
	}
	
	
	@RequestMapping("searchDAT")
	public Object searchDAT(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			param.setCustomConnection(cc);
			Map<Object,Object> result=cs.searchDAT(param);
			return new JsonResult(result);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	
	
	/**
	 * 根据数据库id查询表名
	 * @param param
	 * @return
	 */
	@RequestMapping("getTables")
	public Object getTables(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			List<String> tbls=new ArrayList<String>();
			int total=0;
			tbls=cs.getTables(param.getDbName(), param.getTblName(), cc);
			total=tbls.size();
			Page<String> page=new Page<String>();
			page.setTotal(total);
			page.setRows(tbls);
			page.setPageIndex(param.getPage());
			return JSONObject.toJSON(new JsonResult(page));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	
	/**
	 * 根据数据库名查询表名,自动补全时使用
	 * @param param
	 * @return
	 */
	@RequestMapping("getTablesByDbName")
	public Object getTablesByDbName(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			List<String> tables= cs.getTables(param.getDbName(), param.getTblName(), cc);
			return new JsonResult(tables);
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	
	
	/**
	 * 查询字段
	 * @param param 需要有connId,tblId,tblName,dbName
	 * @param request
	 * @return
	 */
	@RequestMapping("getCols")
	public Object getCols(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			List<Column> cols=new ArrayList<Column>();
			cols= cs.getColumn(param.getDbName(), param.getTblName(), cc);
			return new JsonResult(cols);
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	/**
	 * 查询字段
	 * @param param 需要有connId,tblName,dbName
	 * @param request
	 * @return
	 */
	@RequestMapping("getColsByTblName")
	public Object getColsByTblName(Param param){
		try {
			CustomConnection cc=cs.getConnection(param.getConnId());
			List<String> cols=new ArrayList<String>();
			List<Column> col= cs.getColumn(param.getDbName(), param.getTblName(), cc);
			for (Column column : col) {
				cols.add(column.getColName());
			}
			return new JsonResult(cols);
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	/**
	 * 查询所有的自定义条目
	 * @param param
	 * @return
	 */
	@RequestMapping("getCustomEntryList")
	public Object getCustomEntryList(Param param,HttpSession session){
		param.setLoginName((String) session.getAttribute("username"));
		try {
			List<CustomEntry> list=ces.getCustomEntryList(param);
			int total=ces.getCustomEntryListCount(param);
			Page<CustomEntry> page=new Page<CustomEntry>();
			page.setTotal(total);
			page.setRows(list);
			page.setPageIndex(param.getPage());
			return new JsonResult(page);
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
		
	}
	/**
	 * 根据id查询条目
	 * @param param
	 * @return
	 */
	@RequestMapping("getCustomEntryById")
	public Object getCustomEntryById(HttpSession session,Param param){
		param.setLoginName((String) session.getAttribute("username"));
		try {
			return new JsonResult(ces.getCustomEntryById(param));
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
		
	}
	/**
	 * 保存条目
	 * @param ce
	 * @return
	 */
	@RequestMapping("savaCustomEntry")
	public Object savaCustomEntry(HttpSession session,CustomEntry ce){
		ce.setLoginName((String) session.getAttribute("username"));
		if(ce.getAlias()==null){
			ce.setAlias(ce.getContext().substring(0, 49));
		}
		try {
			if(ce.getId()>0){
				return new JsonResult(ces.updateCustomEntry(ce));
			}
			if(ces.saveCustomEntry(ce)==1){
				return new JsonResult(ce.getId());
			}else{
				return new JsonResult(ResponseCode.FAIL, null);
			}
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	/**
	 * 更新条目
	 * @param ce
	 * @return
	 */
	@RequestMapping("updateCustomEntry")
	public Object updateCustomEntry(HttpSession session,CustomEntry ce){
		ce.setLoginName((String) session.getAttribute("username"));
		if(ce.getAlias()==null){
			ce.setAlias(ce.getContext().substring(0, 49));
		}
		try {
			if(ces.updateCustomEntry(ce)==1){
				return new JsonResult(ce.getId());
			}else{
				return new JsonResult(ResponseCode.FAIL, null);
			}
			
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	
	/**
	 * 删除条目
	 * @param ce
	 * @return
	 */
	@RequestMapping("delCustomEntry")
	public Object delCustomEntry(HttpSession session,CustomEntry ce){
		Param param=new Param();
		param.setId(ce.getId());
		param.setLoginName((String) session.getAttribute("username"));
		try {
			return new JsonResult(ces.delCustomEntry(param));
		} catch (Exception e) {
			logger.error(e,e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	
	/**
	 * 获取或设置语言
	 * @param ce
	 * @return
	 */
	@RequestMapping("Language")
	public Object Language(String lang,HttpServletRequest request){
		String language=ContextServer
				.getInstance()
				.getConfig()
				.get(PriestSqlConfiguration.LANGUAGE,
						PriestSqlConfiguration.LANGUAGE_DEFAULT);
		if(StringUtils.isBlank(lang)){
			request.getSession().setAttribute("lang", language);
			return new JsonResult(language);
		}else{
			request.getSession().setAttribute("lang", lang);
			return new JsonResult(lang);
		}
	}
		
	
}
