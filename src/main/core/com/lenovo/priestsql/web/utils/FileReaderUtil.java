package com.lenovo.priestsql.web.utils;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

public class FileReaderUtil {

	public static String readProperties(String fileName,String key) throws IOException  
    {  
        Properties p = new Properties();  
        InputStream in = new BufferedInputStream(new FileInputStream(Thread  
                .currentThread().getContextClassLoader().getResource(fileName).getPath()));  
        InputStreamReader isr=new InputStreamReader(in,"UTF-8");
        p.load(isr);  
        isr.close();
        in.close();  
        return  p.getProperty(key);  
    } 
}
