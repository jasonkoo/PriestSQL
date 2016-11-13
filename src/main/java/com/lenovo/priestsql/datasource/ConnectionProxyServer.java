package com.lenovo.priestsql.datasource;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;

import com.google.common.base.Preconditions;


public final class ConnectionProxyServer{
	
	/**
	 * Get <code>Connection</code> proxy object.
	 * @param pool	owner of <code>Connection</code> proxy object.
	 * @param target Target object
	 * @return
	 */
	public Connection getConnectionProxy(Connection target,ConnectionPool pool){
		Preconditions.checkNotNull(target,"Target object must not be null");
		Preconditions.checkNotNull(pool,"Pool object must not be null");
		Class<?> connectionInter = getConnectionInter(target.getClass());
		return (Connection)Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(), 
				new Class<?>[]{connectionInter},new ConnectionInvocationHandler(target,pool));
	}
	
	private Class<?> getConnectionInter(Class<?> clazz) {
		Class<?>[] inters = clazz.getInterfaces();
		for(Class<?> cla : inters){
			if(Connection.class.isAssignableFrom(cla)){
				return cla;
			}
		}
		return getConnectionInter(clazz.getSuperclass());
	}

	class ConnectionInvocationHandler implements InvocationHandler {
		private final Connection target;
		private final ConnectionPool pool;
		public ConnectionInvocationHandler(Connection target,ConnectionPool pool){
			this.target = target;
			this.pool = pool;
		}
		@Override
		public Object invoke(Object proxy, Method method, Object[] args) throws Throwable{
			boolean isClose = false;
			try{
				if("close".equals(method.getName())){
					isClose = true;
				}
				return isClose ? null : method.invoke(this.target, args);
			}finally{
				if(isClose){
					this.pool.returnConnection((Connection)proxy);
				}
			}
		}
	}
}