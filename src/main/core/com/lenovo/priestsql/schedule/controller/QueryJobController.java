package com.lenovo.priestsql.schedule.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.RequestContext;
import org.springframework.web.util.WebUtils;

import parquet.org.slf4j.Logger;
import parquet.org.slf4j.LoggerFactory;

import com.lenovo.priestsql.schedule.entity.QueryEntity;
import com.lenovo.priestsql.schedule.entity.QueryExecutionEntity;
import com.lenovo.priestsql.schedule.service.ScheduleService;
import com.lenovo.priestsql.web.entity.Page;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.ResponseCode;

/**
 * <code>QueryJobController</code>
 * @author andy.zheng zhengwei16@lenovo.com
 * @version 1.0 2016/9/2 14:01
 */
@RestController
@RequestMapping("/queryjob")
public class QueryJobController {

	private static Logger log = LoggerFactory.getLogger(QueryJobController.class);

	@Autowired
	private ScheduleService scheduleService;

	@Autowired
	private HttpServletRequest request;

	@RequestMapping("/list")
	public JsonResult list(final int page, final int pageSize) {
		JsonResult result = null;

		try {
			Map<String, Object> filters = new HashMap<>();
			String searchKey = request.getParameter("searchKey");
			if (StringUtils.isNotEmpty(searchKey)) {
				filters.put("searchKey", searchKey);
			}
			String username = (String)WebUtils.getSessionAttribute(request, "username");
			String sortColumns = StringUtils.isNotEmpty(request.getParameter("sortColumns")) ? request.getParameter("sortColumns") : "createDate desc";
			filters.put("sortColumns", sortColumns);
			Page<QueryEntity> pager = scheduleService.queryJobs(username, page, pageSize, true, filters);
			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
			result.setData(pager);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.list!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}

		return result;
	}

	@RequestMapping("/showExecutionHistory")
	public JsonResult showExecutionHistory(final int page, final int pageSize) {
		JsonResult result = null;

		try {
			Map<String, Object> filters = new HashMap<>();
			String searchKey = request.getParameter("searchKey");
			if (StringUtils.isNotEmpty(searchKey)) {
				filters.put("searchKey", searchKey);
			}
			String queryId = request.getParameter("queryId");
			if (StringUtils.isNotEmpty(queryId)) {
				filters.put("queryId", queryId);
			}
			String startDate = request.getParameter("startDate");
			if (StringUtils.isNotEmpty(startDate)) {
				filters.put("startDate", startDate);
			}
			String endDate = request.getParameter("endDate");
			if (StringUtils.isNotEmpty(endDate)) {
				filters.put("endDate", endDate);
			}
			String sortColumns = StringUtils.isNotEmpty(request.getParameter("sortColumns")) ? request.getParameter("sortColumns") : "id desc";
			filters.put("sortColumns", sortColumns);
			String username = (String)WebUtils.getSessionAttribute(request, "username");
			Page<QueryExecutionEntity> pager = scheduleService.findQueryExecutionEntityList(username, page, pageSize, filters);

			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
			result.setData(pager);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.show!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}
		return result;
	}

	@RequestMapping("/history/list")
	public JsonResult historyList(final int page, final int pageSize) {
		JsonResult result = null;

		try {
			String username = (String)WebUtils.getSessionAttribute(request, "username");
			Map<String, Object> filters = new HashMap<>();
			String searchKey = request.getParameter("searchKey");
			if (StringUtils.isNotEmpty(searchKey)) {
				filters.put("searchKey", searchKey);
			}
			String sortColumns = StringUtils.isNotEmpty(request.getParameter("sortColumns")) ? request.getParameter("sortColumns") : "createDate desc";
			filters.put("sortColumns", sortColumns);
			Page<QueryEntity> list = scheduleService.queryJobs(username, page, pageSize, false, filters);

			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
			result.setData(list);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.historyList!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}

		return result;
	}

	@RequestMapping("/create")
	public JsonResult create(QueryEntity queryEntity) {
		JsonResult result = null;

		try {
			String username = (String)WebUtils.getSessionAttribute(request, "username");
			queryEntity.setOwner(username);
			scheduleService.addJob(queryEntity);

			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.create!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}

		return result;
	}

	@RequestMapping("/edit")
	public JsonResult edit(QueryEntity queryEntity) {
		JsonResult result = null;

		try {
			String username = (String)WebUtils.getSessionAttribute(request, "username");
			queryEntity.setOwner(username);
			scheduleService.updateJob(queryEntity, false);

			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.edit!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}

		return result;
	}

	@RequestMapping("/delete")
	public JsonResult delete(final int id) {
		JsonResult result = null;
		try {
			scheduleService.deleteJob(id, true);
			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.delete!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}
		return result;
	}

	@RequestMapping("/enable")
	public JsonResult enable(final int id) {
		JsonResult result = null;
		try {
			scheduleService.enableJob(id);
			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.enable!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}
		return result;
	}

	@RequestMapping("/disable")
	public JsonResult disable(final int id) {
		JsonResult result = null;
		try {
			scheduleService.disableJob(id);
			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.disable!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}
		return result;
	}

	@RequestMapping("/stop")
	public JsonResult stop(final int id, final int jobId) {
		JsonResult result = null;
		try {
			boolean stopped= scheduleService.stopJob(id, jobId);
			result = new JsonResult();
			if (stopped) {
				result.setCode(ResponseCode.SUCCESS);
			} else {
				result.setCode(ResponseCode.FAIL);
			}
		} catch (Exception e) {
			log.error("Failed to invoke JobController.stop!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}
		return result;
	}

	@RequestMapping("/restart")
	public JsonResult restart(final int id) {
		JsonResult result = null;

		try {
			scheduleService.reRunJob(id);
			result = new JsonResult();
			result.setCode(ResponseCode.SUCCESS);
		} catch (Exception e) {
			log.error("Failed to invoke JobController.restart!", e);
			RequestContext context = new RequestContext(request);
			String message = context.getMessage(e.getMessage(), e.getMessage());
			result = new JsonResult(ResponseCode.FAIL, message);
		}

		return result;
	}
}
