package com.example.messenger.chat.conversationParticipant.DTO;

public record ReadUpdateEvent(
        Long participantId,
        Long lastReadMessageId
) {
}
