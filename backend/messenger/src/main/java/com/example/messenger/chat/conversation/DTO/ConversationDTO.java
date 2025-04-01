package com.example.messenger.chat.conversation.DTO;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import com.example.messenger.chat.conversation.model.ConversationType;
import com.example.messenger.chat.conversation.theme.model.Theme;

import java.time.LocalDateTime;

public record ConversationDTO(
        Long id,
        ConversationType type,
        String title,
        byte[] imageData,
        Theme theme,
        Emoji emoji,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
