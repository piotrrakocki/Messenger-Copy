package com.example.messenger.registration;

import com.example.messenger.user.model.Gender;

import java.time.LocalDate;

public record RegistrationRequest(
        String firstName,
        String lastName,
        String email,
        LocalDate dateOfBirth,
        Gender gender,
        String password
) {
}
