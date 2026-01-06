package com.nabil.sra.exception;

public class WriteConflictException extends RuntimeException {
    public WriteConflictException(String msg) {
        super(msg);
    }
}
