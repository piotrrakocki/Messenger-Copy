package com.example.messenger.user.ProfilePicture.controller;

import com.example.messenger.user.ProfilePicture.service.ProfilePictureService;
import com.example.messenger.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/profile-picture")
@RequiredArgsConstructor
@Slf4j
public class ProfilePictureController {

    private final ProfilePictureService profilePictureService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<String> addProfilePicture(Authentication authentication, @RequestParam("image") MultipartFile file) throws IOException {
        profilePictureService.addProfilePicture(authentication, file.getBytes());
        return ResponseEntity.ok("Profile picture added successfully.");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProfilePicture(Authentication authentication, @RequestParam("image") MultipartFile file) throws IOException {
        profilePictureService.updateProfilePicture(authentication, file.getBytes());
        return ResponseEntity.ok("Profile picture updated successfully.");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProfilePicture(Authentication authentication) {
        log.info("Received request to delete profile picture");
        profilePictureService.deleteProfilePicture(authentication);
        log.info("Profile picture deletion process completed");
        return ResponseEntity.ok("Profile picture deleted successfully.");
    }


    @GetMapping("/get")
    public ResponseEntity<byte[]> getProfilePicture(Authentication authentication) {

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
                .body(profilePictureService.getProfilePicture(authentication));
    }
}
