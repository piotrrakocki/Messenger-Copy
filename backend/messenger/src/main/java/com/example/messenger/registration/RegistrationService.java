package com.example.messenger.registration;

public interface RegistrationService {

    String register(RegistrationRequest registrationRequest);

    String confirmToken(String token);
}
