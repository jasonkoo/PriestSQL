package com.lenovo.priestsql.web.exception;

public enum ErrorLog {

    L101(101, "Permission denied:"), L102(102, "[Error 10001]:"), L103(103, "语法错误");

    private final int    code;
    private final String message;

    ErrorLog(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
