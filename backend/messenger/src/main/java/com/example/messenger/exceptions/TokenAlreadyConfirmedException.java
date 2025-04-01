package com.example.messenger.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class TokenAlreadyConfirmedException extends RuntimeException {
    public TokenAlreadyConfirmedException(String message) {
        super(message);
    }
}
