package com.lenovo.priestsql.web.entity.hive;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.Path;

public class HdfsFile {

	/**
	 * 路径名
	 */
	private Path path;
	/**
	 * 大小
	 */
	private long length;
	/**
	 * 修改时间
	 */
	private String ModificationTime;
	/**
	 * 所有人
	 */
	private String owner;
	/**
	 * 所在组
	 */
	private String group;
	/**
	 * 权限
	 */
	private String permission;
	/**
	 * 是否文件夹
	 */
	private boolean dir;
	/**
	 * 是否可编辑
	 */
	private boolean editable;
	
	private List<HdfsFile> sons;
	
	public HdfsFile(){
		
	}
	
	public HdfsFile(FileStatus fs){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		this.path = fs.getPath();
		this.length=fs.getLen();
		this.ModificationTime=sdf.format(new Date(fs.getModificationTime()));
		this.owner=fs.getOwner();
		this.group=fs.getGroup();
		this.permission=fs.getPermission().toString();
		this.dir=fs.isDirectory();
		this.editable=checkEditable(fs.getPath());
	}
	
	public Path getPath() {
		return path;
	}
	public void setPath(Path path) {
		this.path = path;
	}

	public long getLength() {
		return length;
	}

	public void setLength(long length) {
		this.length = length;
	}

	public String getModificationTime() {
		return ModificationTime;
	}

	public void setModificationTime(String modificationTime) {
		ModificationTime = modificationTime;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getPermission() {
		return permission;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}

	public boolean isDir() {
		return dir;
	}

	public void setDir(boolean dir) {
		this.dir = dir;
	}

	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public List<HdfsFile> getSons() {
		return sons;
	}

	public void setSons(List<HdfsFile> sons) {
		this.sons = sons;
	}
	
	private String getParentPath(Path path){
		String paranetPath=path.getParent().getName();
		if(path.getParent().isRoot()){
			return paranetPath;
		}else{
			return getParentPath(path.getParent())+"/"+paranetPath;
		}
	}
	

	private boolean checkEditable(Path path){
		String fullPath=getParentPath(path)+"/"+path.getName();
		if(fullPath.matches("^/(ftpupload|user)/u_[A-Za-z0-9_-]+/[^\\:*?'<>|]*")){
			return true;
		}else if(fullPath.matches("^/uploads/[A-Za-z0-9_-]+/[^\\:*?'<>|]*")){
			return true;
		}else{
			return false;
		}
	}
}
