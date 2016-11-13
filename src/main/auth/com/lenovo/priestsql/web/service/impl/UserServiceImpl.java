package com.lenovo.priestsql.web.service.impl;

import com.lenovo.priestsql.PriestSqlConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.lenovo.leapid.common.Leapid;
import com.lenovo.leapid.common.exception.LeapidException;
import com.lenovo.priestsql.web.service.UserService;
import com.lenovo.priestsql.web.utils.LeapidUtil;

@Service
public class UserServiceImpl implements UserService {

	private static Logger logger = LoggerFactory.getLogger(UserService.class);

	@Override
	public Leapid getLeapid(String username, String password) {
		Leapid leapid = LeapidUtil.getLeapidService().getLeapid(username, password, PriestSqlConfiguration.CURRENT_APPLICATION_NAME);
		return leapid;
	}

	@Override
	public boolean updatePassword(String username, String originPassword, String newPassword) throws LeapidException {
		try {
			LeapidUtil.getLeapidService().updatePassword(username, originPassword, newPassword);
			return true;
		} catch (LeapidException e) {
			logger.error(e.getMessage(), e);
			return false;
		}
	}

	@Override
	public boolean resetPassword(String username, String newPassword) {
		return LeapidUtil.getLeapidService().resetPassword(username, newPassword) == 0;
	}

	@Override
	public Leapid createLeapid(Leapid leapid) throws LeapidException {
		return LeapidUtil.getLeapidService().createLeapid(leapid);
	}


}
