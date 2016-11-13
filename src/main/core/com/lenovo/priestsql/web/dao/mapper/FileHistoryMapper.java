package com.lenovo.priestsql.web.dao.mapper;

import com.lenovo.priestsql.web.entity.FileHistory;
import com.lenovo.priestsql.web.entity.Param;

@SuppressWarnings("rawtypes")
public interface FileHistoryMapper extends Mapper{

	
	FileHistory getFileHistory(Param param);
	
	int saveFileHistory(FileHistory fh);
	
}
