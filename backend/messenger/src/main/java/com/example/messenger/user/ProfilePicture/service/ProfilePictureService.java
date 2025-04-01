package com.example.messenger.user.ProfilePicture.service;

import org.springframework.security.core.Authentication;

public interface ProfilePictureService {

    void addProfilePicture(Authentication authentication, byte[] imageData);

    void updateProfilePicture(Authentication authentication, byte[] imageData);

    void deleteProfilePicture(Authentication authentication);

    byte[] getProfilePicture(Authentication authentication);
}
