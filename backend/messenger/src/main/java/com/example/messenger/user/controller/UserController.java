package com.example.messenger.user.controller;

import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import com.example.messenger.user.DTO.UserNameDTO;
import com.example.messenger.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getFirstAndLastName")
    public ResponseEntity<UserNameDTO> userDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserNameDTO firstAndLastName = userService.getFirstAndLastName(authentication.getName());
        return ResponseEntity.ok(firstAndLastName);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserNameAndPictureDTO>> searchUsers(@RequestParam String query) {
        List<UserNameAndPictureDTO> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}
