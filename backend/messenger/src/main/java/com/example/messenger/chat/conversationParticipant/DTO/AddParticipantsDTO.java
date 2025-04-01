package com.example.messenger.chat.conversationParticipant.DTO;

import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.user.DTO.UserNameAndPictureDTO;

import java.util.List;

public record AddParticipantsDTO(
        MessageDTO messageDTO,
        List<UserNameAndPictureDTO> userNameAndPictureDTOS
) {
}
