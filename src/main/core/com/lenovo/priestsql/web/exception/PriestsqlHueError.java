package com.lenovo.priestsql.web.exception;

public enum PriestsqlHueError {

    // EIW E:error level, I:info level, W:warning level(system operate failed)

    E101("E", 101, "request parmas error"),
    E204("E", 204, "save error"), 
    E301("E", 301, "no permisson"),
    E500("E", 500, "system error");

    private final String level;
    private final int    code;
    private final String message;

    PriestsqlHueError(String level, int code, String message) {
        this.level = level;
        this.code = code;
        this.message = message;
    }

    public String getLevel() {
        return level;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
