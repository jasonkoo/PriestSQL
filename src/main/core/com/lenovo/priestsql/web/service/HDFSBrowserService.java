package com.lenovo.priestsql.web.service;

import java.io.File;
import java.util.List;

import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.hive.HdfsFile;

public interface HDFSBrowserService {

	
	public List<HdfsFile> listFile(Param param) throws Exception;
	
	public List<HdfsFile> targetPath(Param param) throws Exception;
	
	public boolean renameFileOrDirectory(Param param) throws Exception;
	
	public Object[] moveFile(Param param) throws Exception;;
	
	public File downloadFile(Param param) throws Exception;;
	
	public byte[] readFile(Param param) throws Exception;
	
	public boolean createDirectory(Param param) throws Exception;;
	
	public boolean deleteDirectory(Param param) throws Exception;;
	
	public boolean createFile(Param param) throws Exception;;
	
	public boolean deleteFile(Param param) throws Exception;

	public void uncompressFile(Param param) throws Exception;

	public boolean copyFile(Param param)throws Exception;

	public void loadFileToHive(Param param)throws Exception;

}
