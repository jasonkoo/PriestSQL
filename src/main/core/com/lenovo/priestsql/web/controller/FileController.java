package com.lenovo.priestsql.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovo.priestsql.web.entity.FileHistory;
import com.lenovo.priestsql.web.entity.FileHistory.operatTypeEnum;
import com.lenovo.priestsql.web.entity.Page;
import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.hive.HdfsFile;
import com.lenovo.priestsql.web.service.ConnectionService;
import com.lenovo.priestsql.web.service.HDFSBrowserService;
import com.lenovo.priestsql.web.service.HistoryService;
import com.lenovo.priestsql.web.utils.JsonResult;
import com.lenovo.priestsql.web.utils.ResponseCode;

@RequestMapping("file")
@RestController
public class FileController extends BaseController {

	Logger logger = Logger.getLogger(FileController.class);

	@Autowired
	private HDFSBrowserService hbs;
	@Autowired
	private HistoryService hs;
	@Autowired
	private ConnectionService cs;

	/**
	 * 获取文件列表
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("fileList")
	public Object fileList(HttpSession session, Param param) {
		try {
			param.setLoginName((String) session.getAttribute("username"));
			List<HdfsFile> files = hbs.listFile(param);
			if(StringUtils.isNotBlank(param.getOrderBy())){
				orderList(files,param);
			}
			if (files != null) {
				Page<HdfsFile> page = memoryPage(files, param.getPage(),
						param.getPageSize());
				HashMap<String, Object> hm = new HashMap<String, Object>();
				hm.put("buildable",true);
				hm.put("files", page);
				return new JsonResult(hm);
			} else {
				return new JsonResult(ResponseCode.FAIL,
						"File " + param.getPath()
								+ " does not exist or user "
								+ param.getProxyUserName()
								+ " does not have the permission!");
			}

		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}

	/**
	 * 获取移动目标文件列表
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("targetPath")
	public Object targetPath(HttpSession session, Param param) {
		try {
			param.setLoginName((String) session.getAttribute("username"));
			List<HdfsFile> files = hbs.targetPath(param);
			return new JsonResult(files);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}

	/**
	 * 重命名文件或路径
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("renameFileOrDirectory")
	public Object renameFileOrDirectory(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param,
				operatTypeEnum.RENAME_FILE_OR_PATH);
		try {
			if (hbs.renameFileOrDirectory(param)) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL,
						"Please check if duplicate filename or filename contains illegal chars");
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 移动文件
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("moveFile")
	public Object moveFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.MOVE_FILE);
		try {
			Object[] result= hbs.moveFile(param);
			if ((boolean) result[0]) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL,
						"Failed to move some path :"+result[1]);
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 复制文件
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("copyFile")
	public Object copyFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.COPY_FILE);
		try {
			if(hbs.copyFile(param)){
				fh.setResult(1);
				return new JsonResult();
			}else{
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL,null);
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 验证文件
	 * 
	 * @param request
	 * @param param
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("checkFile")
	public Object checkFile(HttpServletRequest request,
			HttpServletResponse response, Param param){
		File file = null;
		try {
			file = hbs.downloadFile(param);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
		if(file!=null){
			return new JsonResult(file.getPath());
		}else{
			return new JsonResult(ResponseCode.FAIL, "no such file or file is larger than 30M or permission denied!");
		}
	}
	
	/**
	 * 下载文件
	 * 
	 * @param request
	 * @param param
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("downloadFile")
	public void downloadFile(HttpSession session, HttpServletRequest request,
			HttpServletResponse response, Param param) throws Exception {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.DOWNLOAD_FILE);
		File file = new File("/"+param.getPath());
		if (file != null) {
			String fileName = file.getName();
			// 1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
			response.setContentType("multipart/form-data");
			String userAgent = request.getHeader("User-Agent");
			byte[] bytes = userAgent.contains("MSIE") ? fileName.getBytes()
					: fileName.getBytes("UTF-8"); // name.getBytes("UTF-8")处理safari的乱码问题
			fileName = new String(bytes, "ISO-8859-1");
			// 2.设置文件头：最后一个参数是设置下载文件名(假如我们叫a.pdf)
			response.setHeader("Content-Disposition",
					String.format("attachment; filename=\"%s\"", fileName));
			ServletOutputStream out = null;
			FileInputStream inputStream = null;
			try {
				inputStream = new FileInputStream(file);
				// 3.通过response获取ServletOutputStream对象(out)
				out = response.getOutputStream();
				int b = 0;
				byte[] buffer = new byte[512];
				while ((b = inputStream.read(buffer)) != -1) {
					// 4.写到输出流(out)中
					out.write(buffer, 0, b);
				}
				out.flush();
			} catch (Exception e) {
				logger.error(e, e);
			} finally {
				if (inputStream != null) {
					inputStream.close();
				}
				if (out != null) {
					out.close();
				}
			}
			fh.setResult(1);
			hs.saveFileHistory(fh);
		} 
	}

	/**
	 * 解压文件
	 * 
	 * @param request
	 * @param response
	 * @param param
	 * @return
	 */
	@RequestMapping("uncompressFile")
	public Object uncompressFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.UNCOMPRESS_FILE);
		try {
			hbs.uncompressFile(param);
			fh.setResult(1);
			return new JsonResult();
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 读取文件
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("readFile")
	public Object readFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.READ_FILE);
		try {
			byte[] result = hbs.readFile(param);
			if (result != null) {
				fh.setResult(1);
				return new JsonResult(
						new String(result, param.getCharsetName()));
			} else {
				fh.setResult(0);
				return new JsonResult(null);
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 创建文件夹
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("createDirectory")
	public Object createDirectory(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.ADD_PATH);
		try {
			if (hbs.createDirectory(param)) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL,
						"Please check if duplicate filename or filename contains illegal chars");
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 删除文件夹
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("deleteDirectory")
	public Object deleteDirectory(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.DEL_PATH);
		try {
			if (hbs.deleteDirectory(param)) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL, null);
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 创建文件
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("createFile")
	public Object createFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.ADD_FILE);
		try {
			if (hbs.createFile(param)) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL,
						"Please check if duplicate filename or filename contains illegal chars");
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 删除文件
	 * 
	 * @param request
	 * @param param
	 * @return
	 */
	@RequestMapping("deleteFile")
	public Object deleteFile(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		FileHistory fh = new FileHistory(param, operatTypeEnum.DEL_FILE);
		try {
			if (hbs.deleteFile(param)) {
				fh.setResult(1);
				return new JsonResult();
			} else {
				fh.setResult(0);
				return new JsonResult(ResponseCode.FAIL, null);
			}
		} catch (Exception e) {
			logger.error(e, e);
			fh.setResult(0);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		} finally {
			hs.saveFileHistory(fh);
		}
	}

	/**
	 * 将文件加载进hive表
	 * 
	 * @return
	 */
	@RequestMapping("loadFileToHive")
	public Object loadFileToHive(HttpSession session, Param param) {
		param.setLoginName((String) session.getAttribute("username"));
		try {
			hbs.loadFileToHive(param);
			return new JsonResult(ResponseCode.SUCCESS, null);
		} catch (Exception e) {
			logger.error(e, e);
			return new JsonResult(ResponseCode.FAIL, e.getMessage());
		}
	}
	private void orderList(List<HdfsFile> files, Param param) {
		final String orderBy = param.getOrderBy();
		final String orderRule = param.getOrderRule();
		Collections.sort(files, new Comparator<HdfsFile>() {
			@Override
			public int compare(HdfsFile o1, HdfsFile o2) {
				try {
					if ("length".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return (int) (o1.getLength() - o2.getLength());
						} else {
							return (int) (o2.getLength() - o1.getLength());
						}
					} else if ("modificationTime".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return o1.getModificationTime().compareTo(
									o2.getModificationTime());
						} else {
							return o2.getModificationTime().compareTo(
									o1.getModificationTime());
						}
					} else if ("name".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return o1.getPath().getName()
									.compareTo(o2.getPath().getName());
						} else {
							return o2.getPath().getName()
									.compareTo(o1.getPath().getName());
						}
					} else if ("owner".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return o1.getOwner().compareTo(o2.getOwner());
						} else {
							return o2.getOwner().compareTo(o1.getOwner());
						}
					} else if ("group".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return o1.getGroup().compareTo(o2.getGroup());
						} else {
							return o2.getGroup().compareTo(o1.getGroup());
						}
					} else if ("permission".equalsIgnoreCase(orderBy)) {
						if ("asc".equalsIgnoreCase(orderRule)) {
							return o1.getPermission().compareTo(
									o2.getPermission());
						} else {
							return o2.getPermission().compareTo(
									o1.getPermission());
						}
					}
				} catch (Exception e) {
					return 0;
				}
				return 0;
			}
		});

	}
}
