package com.example.messenger.user.service;

import com.example.messenger.exceptions.EmailAlreadyTakenException;
import com.example.messenger.exceptions.UserNameDTONotFoundException;
import com.example.messenger.exceptions.UserNotFoundException;
import com.example.messenger.registration.token.model.ConfirmationToken;
import com.example.messenger.registration.token.service.ConfirmationTokenService;
import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import com.example.messenger.user.DTO.UserNameDTO;
import com.example.messenger.user.ProfilePicture.model.ProfilePicture;
import com.example.messenger.user.ProfilePicture.repository.ProfilePictureRepository;
import com.example.messenger.user.model.AppUser;
import com.example.messenger.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final String USER_NOT_FOUND_MSG = "User with email %s not found";
    private final String UserNameDTO_NOT_FOUND_MSG = "UserNameDTO with email $s not found";
    private final UserRepository userRepository;
    private final ProfilePictureRepository profilePictureRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ConfirmationTokenService confirmationTokenService;

    @Override
    public UserDetails loadByUsername(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException(String.format(USER_NOT_FOUND_MSG, email))
        );
    }

    @Override
    public UserNameDTO getFirstAndLastName(String username) {
        return userRepository.findFirstAndLastNameByEmail(username).orElseThrow(
                () -> new UserNameDTONotFoundException(String.format(USER_NOT_FOUND_MSG, UserNameDTO_NOT_FOUND_MSG)));
    }

    @Override
    public List<UserNameAndPictureDTO> searchUsers(String query) {
        List<UserNameDTO> users = userRepository.searchByFirstNameOrLastName(query);
        List<Long> userIds = users.stream()
                .map(UserNameDTO::id)
                .toList();
        List<ProfilePicture> profilePictures = profilePictureRepository.findByUserIds(userIds);

        Map<Long, byte[]> profilePictureMap = profilePictures.stream()
                .collect(Collectors.toMap(
                        p -> p.getAppUser().getId(),
                        ProfilePicture::getImageData
                ));

        return users.stream()
                .map(user -> new UserNameAndPictureDTO(
                        user.id(),
                        user.firstName(),
                        user.lastName(),
                        profilePictureMap.getOrDefault(user.id(), null)
                ))
                .toList();
    }

    @Transactional
    @Override
    public String singUpUser(AppUser user) {
        Optional<AppUser> userExists = userRepository.findByEmail(user.getEmail());

        if (userExists.isPresent()) {
            AppUser existingUser = userExists.get();
            if (existingUser.isEnabled()) {
                throw new EmailAlreadyTakenException("email already taken");
            } else {
                confirmationTokenService.deleteTokensByUser(existingUser);
                userRepository.delete(existingUser);
            }
        }

        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token, LocalDateTime.now(), LocalDateTime.now().plusHours(2), user);
        confirmationTokenService.saveConfirmationToken(confirmationToken);

        return token;
    }

    @Override
    public int enableUser(String email) {
        return userRepository.enableAppUser(email);
    }
}
