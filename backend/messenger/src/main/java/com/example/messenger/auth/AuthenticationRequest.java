package com.example.messenger.auth;

public record AuthenticationRequest (
        String email,
        String password
) {
}
