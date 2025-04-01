package com.example.messenger.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNameDTONotFoundException extends RuntimeException {
    public UserNameDTONotFoundException(String message) {
        super(message);
    }
}
