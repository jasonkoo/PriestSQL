package com.lenovo.priestsql.web.exception;

import java.io.Serializable;

/**
 * @author hcwoop
 * @version $Id: MetaDataPlatException.java, v 0.1 2015-10-22 下午5:21:44 hcwoop Exp $
 */
public class PriestsqlHuePlatException extends RuntimeException implements Serializable {

    /** VersionUID */
    private static final long serialVersionUID = -885164252406900160L;
    private long              errorCode        = -1;

    public PriestsqlHuePlatException(long errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
    }

    public PriestsqlHuePlatException(String msg) {
        super(msg);
    }

    public PriestsqlHuePlatException(long errorCode, String msg, Throwable ex) {
        super(msg, ex);
        this.errorCode = errorCode;
    }

    public PriestsqlHuePlatException(Throwable cause) {
        super(cause);
    }

    public PriestsqlHuePlatException() {
        super();
    }

    public long getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(long errorCode) {
        this.errorCode = errorCode;
    }
}
