package com.lenovo.priestsql.web.task;

import java.io.File;
import java.io.FileFilter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;
import com.lenovo.priestsql.web.utils.FileDelUtil;

public class FileCleanerTask {
	
	Logger logger= Logger.getLogger(FileCleanerTask.class);
	
	
	/**
	 * 每天0点5分执行任务
	 */
	@Scheduled(cron="* 5 0 * * *")
	public void cleanFiles(){
		String path = ContextServer
				.getInstance()
				.getConfig()
				.get(PriestSqlConfiguration.FILE_SAVE_PATH,
						PriestSqlConfiguration.FILE_SAVE_PATH_DEFAULT);
		
		File rootFile=new File(path);
		File[] files=rootFile.listFiles(new FileFilter() {
			Date date=new Date();
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
			@Override
			public boolean accept(File pathname) {
				try {
					if(date.getTime()-sdf.parse(pathname.getName()).getTime()>=2*24*60*60*1000){
						return true;
					}
				} catch (ParseException e) {
					logger.error(e,e);
				}
				return false;
			}
		});
		
		for (File file : files) {
			FileDelUtil.delFile(file);
		}
	}
	
}
