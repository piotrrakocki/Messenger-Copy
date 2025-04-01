package com.example.messenger.chat.conversationParticipant.service;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversationParticipant.DTO.ConversationParticipantDTO;
import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.chat.conversationParticipant.model.ParticipantRole;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ConversationParticipantService {

    ConversationParticipant addParticipant(Long userId, ParticipantRole role, Conversation conversation);

    List<ConversationParticipantDTO> addParticipants(Authentication authentication, MessageDTO messageDTO, List<UserNameAndPictureDTO> userNameAndPictureDTOS, Long conversationId);

    List<ConversationParticipantDTO> getParticipantsByConversationId(Long conversationId);

    ConversationParticipantDTO editNickname(Authentication authentication, MessageDTO messageDTO, Long participantId, String nickname);

    ConversationParticipantDTO changeRole(Authentication authentication, Long conversationId, Long participantId, ParticipantRole role);

    void removeParticipant(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long participantId);
}
