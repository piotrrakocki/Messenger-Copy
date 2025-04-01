package com.example.messenger.chat.message.DTO;

import com.example.messenger.chat.message.model.MsgType;

import java.time.LocalDateTime;

public record MessageDTO(
        Long id,
        Long senderId,
        String senderName,
        byte[] imageData,
        Long conversationId,
        String content,
        MsgType msgType,
        LocalDateTime sentAt
) {
}
