package com.example.messenger.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ThemeNotFoundException extends RuntimeException {
    public ThemeNotFoundException(String message) {
        super(message);
    }
}
