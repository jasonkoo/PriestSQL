package com.lenovo.priestsql.web.client;

import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.conf.Configuration;
import org.apache.log4j.Logger;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;

/**
 * Redis客户端工具类（缺少的方法请自行添加），注意try-catch释放资源
 * @author yuehan1
 * @date 2015年3月26日
 */
public class RedisServerClient {
	
	private static JedisPool jedisPool;

	
	
	//用户信息缓存key前缀,该前缀是'priestsql_hue'的md5值
	public static final String PREFIX = "0621B4751BC607DAB5EF2F391E4D2B69_";
	
	static Logger logger =Logger.getLogger(RedisServerClient.class);
	static {
		Configuration sysconfig = ContextServer.getInstance().getConfig();
		String host = sysconfig.get(PriestSqlConfiguration.REDIS_HOST, PriestSqlConfiguration.REDIS_HOST_DEFAULT);
		int port  = sysconfig.getInt(PriestSqlConfiguration.REDIS_PORT, PriestSqlConfiguration.REDIS_PORT_DEFAULT);
		int maxTotal = sysconfig.getInt(PriestSqlConfiguration.REDIS_MAXTOTAL, PriestSqlConfiguration.REDIS_MAXTOTAL_DEFAULT);
		int maxIdle = sysconfig.getInt(PriestSqlConfiguration.REDIS_MAXIDLE, PriestSqlConfiguration.REDIS_MAXIDLE_DEFAULT);
		long maxWait = sysconfig.getLong(PriestSqlConfiguration.REDIS_MAXWAIT, PriestSqlConfiguration.REDIS_MAXWAIT_DEFAULT);
		JedisPoolConfig config = new JedisPoolConfig();
		config.setMaxTotal(maxTotal);
		config.setMaxIdle(maxIdle);
		config.setMaxWaitMillis(maxWait);
		jedisPool = new JedisPool(config, host, port);
	}

	/**
	 * 获取值
	 */
	public static String get(String key) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			return jedis.get(key);
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		} finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	
	/**
	 * 根据key返回指定的对象
	 */
	public static <T> T get(String key, Class<T> clazz) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			String text = jedis.get(key);
			return text == null ? null : JSON.parseObject(text, clazz);
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}

	@SuppressWarnings("unchecked")
	public static List<Object> get(String key,int page){
		
		Jedis jedis = jedisPool.getResource();
		try {
			String text = jedis.get(key+"_"+page);
			return text == null ? null : JSON.parseObject(text, List.class);
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	/**
	 * 设置值
	 */
	public static void set(String key, Object value) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			if (value instanceof String) {
				jedis.set(key, (String) value);
			} else {
				jedis.set(key, JSON.toJSONString(value));
			}
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	/**
	 * 设置分页保存
	 * @param key
	 * @param value
	 * @param pageCount
	 */
	@SuppressWarnings("static-access")
	public static void set(String key, List<Object> value,int pageSize,int seconds){
		
		Jedis jedis = jedisPool.getResource();
		try {
			List<Object> pages=new ArrayList<Object>();
			int count=0;
			while(true){
				List<Object> page=new ArrayList<Object>();
				page.addAll(value.subList(count, count+pageSize<value.size()?count+pageSize:value.size()));
				count+=pageSize;
				pages.add(page);
				if(count>=value.size()){
					break;
				}
			}
			for (int i = 1; i <= pages.size(); i++) {
				jedis.set(key+"_"+i, new JSONObject(true).toJSONString(pages.get(i-1), SerializerFeature.WriteMapNullValue));
				jedis.expire(key+"_"+i,seconds);
			}
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
		
	}
	/**
	 * 设置分页保存
	 * @param key
	 * @param value
	 * @param pageCount
	 */
	@SuppressWarnings("static-access")
	public static void set(String key, List<Object> value,int pageSize){
		
		Jedis jedis = jedisPool.getResource();
		try {
			List<Object> pages=new ArrayList<Object>();
			int count=0;
			while(true){
				List<Object> page=new ArrayList<Object>();
				page.addAll(value.subList(count, count+pageSize<value.size()?count+pageSize:value.size()));
				count+=pageSize;
				pages.add(page);
				if(count>=value.size()){
					break;
				}
			}
			for (int i = 1; i <= pages.size(); i++) {
				jedis.set(key+"_"+i, new JSONObject(true).toJSONString(pages.get(i-1), SerializerFeature.WriteMapNullValue));
			}
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
		
	}
	/**
	 * 设置值
	 */
	public static void set(String key, Object value,int seconds) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			if (value instanceof String) {
				jedis.set(key, (String) value);
				jedis.expire(key, seconds);
			} else {
				jedis.set(key, JSON.toJSONString(value));
				jedis.expire(key, seconds);
			}
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}

	/**
	 * 删除键值
	 */
	public static void del(String... keys) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.del(keys);
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		} finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}

	/**
	 * 判断缓存项是否存在
	 * @param key
	 * @return
	 */
	public static boolean exists(String key) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			return jedis.exists(key);
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	

	/**
	 * 设置缓存多少秒后自动删除
	 * @param key
	 * @param seconds
	 */
	public static void expire(String key,int seconds){
		
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.expire(key, seconds);
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	/**
	 * 获取byte[]类型的值
	 */
	public static byte[] getBytes(String key) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			return jedis.get(key.getBytes());
		} catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		}finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
	
	/**
	 * 设置值
	 */
	public static void setBytes(String key, byte[] value,int expire) {
		
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.setex(key.getBytes(), expire, value);
		}catch(Exception e){
			logger.error(e, e);
			jedisPool.returnBrokenResource(jedis);
			jedis=null;
			throw e;
		} finally {
			if(jedis !=null){jedisPool.returnResource(jedis);}
		}
	}
}
