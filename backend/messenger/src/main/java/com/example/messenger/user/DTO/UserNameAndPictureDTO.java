package com.example.messenger.user.DTO;

public record UserNameAndPictureDTO(
        Long id,
        String firstName,
        String lastName,
        byte[] imageData
) {
}
