package com.lenovo.priestsql.web.utils;

import java.io.File;
/**
 * 用来删除文件或文件夹的工具类
 * @author zhouyu16
 *
 */
public class FileDelUtil {

	/**
	 * 删除文件或文件夹
	 * @param file
	 */
	public static void delFile(File file){
		if(file.isFile()){
			file.delete();
		}else{
			File[] files=file.listFiles();
			for (File file2 : files) {
				delFile(file2);
			}
			file.delete();
		}
	}
}
