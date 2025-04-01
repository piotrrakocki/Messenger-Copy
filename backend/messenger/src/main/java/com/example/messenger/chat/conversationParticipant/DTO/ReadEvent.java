package com.example.messenger.chat.conversationParticipant.DTO;

public record ReadEvent(
        Long participantId,
        Long messageId
) {
}
