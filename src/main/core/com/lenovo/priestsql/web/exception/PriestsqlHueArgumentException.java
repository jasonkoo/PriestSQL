package com.lenovo.priestsql.web.exception;

public final class PriestsqlHueArgumentException extends PriestsqlHuePlatException {

    /** VersionUID */
    private static final long serialVersionUID = 1708664724969479394L;

    public PriestsqlHueArgumentException() {
        super(PriestsqlHueError.E101.getCode(), PriestsqlHueError.E101.getMessage());
    }

    public PriestsqlHueArgumentException(String msg) {
        super(PriestsqlHueError.E101.getCode(), msg);
    }

    public PriestsqlHueArgumentException(long errorCode, String msg) {
        super(errorCode, msg);
    }

    public PriestsqlHueArgumentException(long errorCode, String msg, Throwable ex) {
        super(errorCode, msg, ex);
    }

    public PriestsqlHueArgumentException(PriestsqlHueError error) {
        super(error.getCode(), error.getMessage());
    }

    public PriestsqlHueArgumentException(PriestsqlHueError error, String parameter) {
        super(error.getCode(), String.format(error.getMessage(), parameter));
    }

    public PriestsqlHueArgumentException(PriestsqlHueError error, Throwable ex) {
        super(error.getCode(), error.getMessage(), ex);
    }

}
