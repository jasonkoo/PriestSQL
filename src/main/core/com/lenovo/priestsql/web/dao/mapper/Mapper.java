package com.lenovo.priestsql.web.dao.mapper;

import java.util.List;
import java.util.Map;


/**
 * MyBatis Mapping interface
 * @author hcw
 * @version $Id: Mapper.java, v 0.1 2015-10-27 下午1:46:47 hcw Exp $
 */
public interface Mapper<T> {

    /**
     * Save entity
     * @param t the entity object
     * @exception Exception
     */
    void save(T t) throws Exception;

    /**
     * Update entity
     * @param t the entity object
     * @exception Exception
     */
    void update(T t) throws Exception;

    /**
     * Delete entity by key
     * @param key the primary key
     * @exception Exception
     */
    void delete(long key) throws Exception;

    /**
     * Find all data
     * @return the list {@link List<T>}
     */
    List<T> findAll(Map<String, String> map);

    /**
     * Select the only object by key
     * @param key the primary key
     * @return the t {@link T}
     */
    T selectOne(long key);

    /**
     * Select the only object by custom params 
     * @param map the custom params
     * @return the object {@link T}
     */
    T selectOne(Map<String, Object> map);

    /**
     * Select the list of the t by custom params
     * @param map the custom params
     * @return the list
     */
    List<T> findByParams(Map<String, Object> map);
}
