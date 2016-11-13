package com.lenovo.priestsql.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.lenovo.leapid.common.Leapid;
import com.lenovo.priestsql.web.service.UserService;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.ResponseCode;


/**
 * 登录的controller
 *
 * @author zhouyu16
 */
@Controller
@RequestMapping("/")
public class LoginController {

	Logger logger = Logger.getLogger(LoginController.class);

	@Autowired
	private UserService us;


	@RequestMapping("login")
	@ResponseBody
	public Object login(Leapid user, HttpSession session) throws Exception {
		try {
			Leapid leapid = us.getLeapid(user.getUsername(), user.getPassword());
			if (leapid != null) {
				session.setAttribute("username", user.getUsername());
				return new JsonResult();
			} else {
				return new JsonResult(ResponseCode.FAIL, "login failed");
			}
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}

	}

	@RequestMapping("logout")
	public ModelAndView logout(HttpSession session) throws Exception {
		//清空当前登录用户的缓存数据,使当前session失效
		session.invalidate();
		return new ModelAndView("/login.jsp");
	}

	@RequestMapping("register")
	@ResponseBody
	public Object register(Leapid user) throws IOException {
		try {
			if (us.createLeapid(user) != null) {
				return new JsonResult();
			} else {
				return new JsonResult(ResponseCode.FAIL, "register failed");
			}
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}


}
