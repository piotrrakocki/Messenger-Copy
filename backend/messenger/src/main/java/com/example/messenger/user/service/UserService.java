package com.example.messenger.user.service;

import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import com.example.messenger.user.DTO.UserNameDTO;
import com.example.messenger.user.model.AppUser;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {

    UserDetails loadByUsername(String email);

    UserNameDTO getFirstAndLastName(String username);

    List<UserNameAndPictureDTO> searchUsers(String query);

    String singUpUser(AppUser user);

    int enableUser(String email);
}
