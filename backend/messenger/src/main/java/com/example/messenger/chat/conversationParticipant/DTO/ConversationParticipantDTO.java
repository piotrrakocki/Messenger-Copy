package com.example.messenger.chat.conversationParticipant.DTO;

import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.chat.conversationParticipant.model.ParticipantRole;
import com.example.messenger.chat.message.model.Message;
import com.example.messenger.user.ProfilePicture.model.ProfilePicture;

import java.time.LocalDateTime;
import java.util.Optional;

public record ConversationParticipantDTO(
        Long id,
        Long userId,
        String fullName,
        byte[] imageData,
        Long conversationId,
        String nickname,
        LocalDateTime joinedAt,
        ParticipantRole role,
        Long lastReadMessageId
) {
    public static ConversationParticipantDTO fromEntity(ConversationParticipant participant) {
        return new ConversationParticipantDTO(
                participant.getId(),
                participant.getUser().getId(),
                participant.getUser().getFullName(),
                Optional.ofNullable(participant.getUser().getProfilePicture())
                                .map(ProfilePicture::getImageData)
                                        .orElse(null),
                participant.getConversation().getId(),
                participant.getNickname(),
                participant.getJoinedAt(),
                participant.getRole(),
                Optional.ofNullable(participant.getLastReadMessage())
                        .map(Message::getId)
                        .orElse(null)
        );
    }
}
