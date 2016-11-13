package com.lenovo.priestsql.web.dao.dataSource;

/**
 * 动态数据源辅助类
 * 调用setDataSourceType方法可改变数据源KEY，达到切换数据源目的
 * 
 * @author liyi7
 */
public final class DataSourceContextHolder {

    /** 保存数据库路由KEY */
    private static ThreadLocal<String> contextHolder = new ThreadLocal<String>();

    private DataSourceContextHolder() {
    }

    /**
     * @param dsType 数据源KEY，@See applicationContext-dao.xml
     */
    public static void setDataSourceType(String dsType) {
        contextHolder.set(dsType);
    }

    public static String getDataSourceType() {
        return contextHolder.get();
    }

    public static void cleanDataSourceType() {
        contextHolder.remove();
    }
}
