package com.lenovo.priestsql.web.exception;

public final class PriestsqlHuePlatOperationException extends PriestsqlHuePlatException {

    /** VersionUID */
    private static final long serialVersionUID = -5912037507463529389L;

    public PriestsqlHuePlatOperationException(long errorCode, String msg) {
        super(errorCode, msg);
    }

    public PriestsqlHuePlatOperationException(long errorCode, String msg, Throwable ex) {
        super(errorCode, msg, ex);
    }

    public PriestsqlHuePlatOperationException(PriestsqlHueError error) {
        super(error.getCode(), String.format(error.getMessage()));
    }

    public PriestsqlHuePlatOperationException(PriestsqlHueError error, String parameter) {
        super(error.getCode(), String.format(error.getMessage(), parameter));
    }

    public PriestsqlHuePlatOperationException(PriestsqlHueError error, Throwable ex) {
        super(error.getCode(), error.getMessage(), ex);
    }

}
