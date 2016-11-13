package com.lenovo.priestsql.web.service;

import com.lenovo.leapid.common.Leapid;
import com.lenovo.leapid.common.exception.LeapidException;

public interface UserService {
	/**
	 * 校验用户密码是否匹配
	 * @param username
	 * @param password
	 * @return
	 */
	public Leapid getLeapid(String username, String password);

	/**
	 * 修改密码（需提供旧密码）
	 * @param username
	 * @param originPassword
	 * @param newPassword
	 * @return
	 */
	public boolean updatePassword(String username, String originPassword, String newPassword) throws LeapidException;

	/**
	 * 重置密码（用于找回密码）
	 * @param username
	 * @param newPassword
	 * @return
	 */
	public boolean resetPassword(String username, String newPassword);

	/**
	 * 创建leapid
	 * @param leapid
	 * @return
	 * @throws LeapidException 
	 */
	public Leapid createLeapid(Leapid leapid) throws LeapidException;
}
