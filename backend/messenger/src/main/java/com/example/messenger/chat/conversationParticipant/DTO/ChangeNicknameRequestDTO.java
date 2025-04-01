package com.example.messenger.chat.conversationParticipant.DTO;

import com.example.messenger.chat.message.DTO.MessageDTO;

public record ChangeNicknameRequestDTO(
        MessageDTO messageDTO,
        String nickname
) {
}
