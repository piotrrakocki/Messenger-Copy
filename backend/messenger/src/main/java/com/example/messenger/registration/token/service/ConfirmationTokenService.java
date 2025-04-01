package com.example.messenger.registration.token.service;

import com.example.messenger.registration.token.model.ConfirmationToken;
import com.example.messenger.user.model.AppUser;

import java.util.Optional;

public interface ConfirmationTokenService {

    void saveConfirmationToken(ConfirmationToken confirmationToken);

    Optional<ConfirmationToken> getToken(String token);

    int setConfirmedAt(String token);

    void deleteTokensByUser(AppUser user);
}
