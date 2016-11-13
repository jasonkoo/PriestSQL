package com.lenovo.priestsql.web.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.lenovo.priestsql.web.entity.Param;
import com.lenovo.priestsql.web.entity.hive.HdfsFile;
import com.lenovo.priestsql.web.service.HDFSBrowserService;
import com.lenovo.priestsql.web.utils.FileWriterUtil;
import com.lenovo.priestsql.web.utils.HDFSUtil;
import com.lenovo.priestsql.web.utils.HiveUtil;
import com.lenovo.priestsql.web.utils.ZipCompressorByAnt;
@Service
public class HDFSBrowserServiceImpl implements HDFSBrowserService {
	
	
	@Override
	public List<HdfsFile> listFile(Param param) throws Exception {
		String path=param.getPath();
		//文件过滤
		String filter=param.getFilefilter();
		List<HdfsFile> filesResultTemp=new ArrayList<HdfsFile>();
		List<HdfsFile> filesResult=new ArrayList<HdfsFile>();
		filesResultTemp=HDFSUtil.listFile(path,null, param.getProxyUserName());
		
		if(StringUtils.isEmpty(filter)){
			return filesResultTemp;
		}else{
			for (HdfsFile hf : filesResultTemp) {
				if(hf.getPath().getName().contains(filter)){
					filesResult.add(hf);
				}
			}
			return filesResult;
		}
	}
	
	public List<HdfsFile> targetPath(Param param) throws Exception{
		String path=param.getPath();
		List<HdfsFile> filesTemp=new ArrayList<HdfsFile>();
		filesTemp=HDFSUtil.listFile(path,null,param.getProxyUserName());
		//保留文件夹
		List<HdfsFile> filesResult=new ArrayList<HdfsFile>();
		for (HdfsFile hdfsFile : filesTemp) {
			if(hdfsFile.isDir()){
				filesResult.add(hdfsFile);
			}
		}
		if(param.getPath()==null){
			for (HdfsFile hdfsFile : filesResult) {
				param.setPathWithoutEncoding(hdfsFile.getPath().getName()+"/");
				List<HdfsFile> sons= targetPath(param);
				hdfsFile.setSons(sons);
			}
		}
		return filesResult;
		
	}

	@Override
	public boolean renameFileOrDirectory(Param param) throws Exception {
		try {
			return HDFSUtil.renameFileOrDirectory(param.getPath(), param.getNewPath(), param.getProxyUserName());
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public Object[] moveFile(Param param) throws Exception{
		try {
			String[] paths=param.getPath().split("\\|\\|");
			boolean flag=true;
			Object[] result=new Object[2];
			for (String path : paths) {
				path=addRoot(path);
				String fileName=getFileOrDirName(path);
				boolean tempflag=HDFSUtil.renameFileOrDirectory(path, param.getNewPath()+"/"+fileName, param.getProxyUserName());
				if(!tempflag){
					if(result[1]!=null){						
						result[1]=path+","+result[1];
					}else{
						result[1]=path;
					}
				}
				flag=flag&tempflag;
			}
			result[0]=flag;
			return result;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean copyFile(Param param) throws Exception {
		try {
			String[] paths=param.getPath().split("\\|\\|");
			String localPath=FileWriterUtil.getLocalPath();
			if(paths.length>1){
				localPath=localPath+new Date().getTime()+"/";
			}
			boolean flag=true;
			for (String path : paths) {
				path=addRoot(path);
				String fileName=path.replace("/", "_");
				flag=flag&HDFSUtil.copyFileOrDirectory(path,localPath+fileName, param.getNewPath(), param.getProxyUserName());
			}
			return flag;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public void uncompressFile(Param param) throws Exception {
		try {
			String[] paths=param.getPath().split("\\|\\|");
			for (String path : paths) {
				path=addRoot(path);
				HDFSUtil.uncompress(path, param.getNewPath(), param.getProxyUserName());
			}
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public File downloadFile(Param param)  throws Exception {
		try {
			String[] paths=param.getPath().split("\\|\\|");
			String localPath=FileWriterUtil.getLocalPath();
			if(paths.length>1){
				localPath=localPath+new Date().getTime();
			}
			List<File> files=new ArrayList<File>();
			for (String path : paths) {
				path=addRoot(path);
				String fileName=path.replace("/", "_");
				File file=new File(localPath+"/"+fileName);
				HDFSUtil.downloadFile(path, localPath+"/"+fileName, param.getProxyUserName());
				if(file.exists()){
					files.add(file);
				}
			}
			if(paths.length==1){
				if(files.size()==1){
					if(files.get(0).isDirectory()){
						String zipPath=files.get(0).getPath();
						if(zipPath.endsWith("/")){
							zipPath=zipPath.substring(1);
						}
						ZipCompressorByAnt zipFile=new ZipCompressorByAnt(localPath+".zip");
						zipFile.compressExe(files.get(0).getPath());
						return zipFile.getZipFile();
					}else{
						return files.get(0);
					}
					
				}else{
					return null;
				}
			}else{
				ZipCompressorByAnt zipFile=new ZipCompressorByAnt(localPath+".zip");
				zipFile.compressExe(localPath);
				return zipFile.getZipFile();
			}
		} catch (Exception e) {
			throw e;
		}
		
	}
	
	@Override
	public byte[] readFile(Param param) throws Exception {
		try {
			String path=param.getPath();
			return HDFSUtil.readFile(param.getPage(),param.getPageSize(),path, param.getProxyUserName());
		}catch(Exception e){
			throw e;
		}
	}


	@Override
	public boolean createDirectory(Param param)  throws Exception{
		try {
			return HDFSUtil.createDirectory(param.getPath(),param.getProxyUserName());
		} catch (Exception e) {
			throw e;
		}
	}


	@Override
	public boolean deleteDirectory(Param param)  throws Exception{
		try {
			String[] paths=param.getPath().split("\\|\\|");
			boolean flag=true;
			for (String path : paths) {
				path=addRoot(path);
				flag=flag&HDFSUtil.deleteDirectory(path, param.getProxyUserName());
			}
			return flag;
			
		} catch (Exception e) {
			throw e;
		}
	}


	@Override
	public boolean createFile(Param param)  throws Exception{
		try {
			return HDFSUtil.createFile(param.getPath(),param.getProxyUserName());
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public boolean deleteFile(Param param)  throws Exception{
		try {
			String[] paths=param.getPath().split("\\|\\|");
			boolean flag=true;
			for (String path : paths) {
				path=addRoot(path);
				flag=flag&HDFSUtil.deleteFile(path, param.getProxyUserName());
			}
			return flag;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public void loadFileToHive(Param param) throws Exception {
		try {
			 String path=param.getPath();
			 if(path.endsWith("/")){
				 path=path+"*";
			 }
			 HiveUtil.load2Hive(path, param.getTblName(), param.getPatitionName(), "yes".equalsIgnoreCase(param.getOverwrite()),  param.getProxyUserName());
		} catch (Exception e) {
			throw e;
		}
	}
	
	

	/**
	 * 获取文件夹或者文件的名字
	 * @param path
	 * @return
	 */
	private  String getFileOrDirName(String path){
		if(path.endsWith("/")){
			path=path.substring(0, path.length()-1);
		}
		String name=path.substring(path.lastIndexOf("/")+1);
		return name;
	}
	private String addRoot(String path){
		if (!path.startsWith("/")) {
			return  "/" + path;
		}
		return path;
	}
}
	
