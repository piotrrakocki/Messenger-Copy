package com.example.messenger.chat.conversation.DTO;

import com.example.messenger.chat.message.DTO.MessageDTO;

public record UpdateTitleDTO(
        MessageDTO messageDTO,
        String newTitle
) {
}
