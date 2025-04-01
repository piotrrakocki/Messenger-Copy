package com.example.messenger.user.ProfilePicture.service;

import com.example.messenger.exceptions.ProfilePictureNotFoundException;
import com.example.messenger.exceptions.UserNotFoundException;
import com.example.messenger.user.ProfilePicture.model.ProfilePicture;
import com.example.messenger.user.ProfilePicture.repository.ProfilePictureRepository;
import com.example.messenger.user.model.AppUser;
import com.example.messenger.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfilePictureServiceImpl implements ProfilePictureService {

    private final UserRepository userRepository;
    private final ProfilePictureRepository profilePictureRepository;

    @Override
    public void addProfilePicture(Authentication authentication, byte[] imageData) {
        AppUser user = findUserByAuthentication(authentication);

        ProfilePicture profilePicture = new ProfilePicture(imageData, user);
        profilePictureRepository.save(profilePicture);
    }

    @Override
    public void updateProfilePicture(Authentication authentication, byte[] imageData) {
        AppUser user = findUserByAuthentication(authentication);

        ProfilePicture profilePicture = user.getProfilePicture();
        if (profilePicture == null) {
            profilePicture = new ProfilePicture(imageData, user);
        } else {
            profilePicture.setImageData(imageData);
        }
        profilePictureRepository.save(profilePicture);
    }

    @Override
    public void deleteProfilePicture(Authentication authentication) {
        AppUser user = findUserByAuthentication(authentication);

        ProfilePicture profilePicture = user.getProfilePicture();
        if (profilePicture != null) {
            user.setProfilePicture(null);
            userRepository.save(user);

            profilePictureRepository.deleteById(profilePicture.getId());
        } else {
            log.info("No profile picture found for user: {}", user.getUsername());
        }
    }

    @Override
    public byte[] getProfilePicture(Authentication authentication) {
        AppUser user = findUserByAuthentication(authentication);

        ProfilePicture profilePicture = user.getProfilePicture();

        if (profilePicture == null) {
            throw new ProfilePictureNotFoundException("Profile picture not found for username: " + user.getUsername());
        }

        return profilePicture.getImageData();
    }

    private AppUser findUserByAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User with username: " + username + " not found."));
    }

}
