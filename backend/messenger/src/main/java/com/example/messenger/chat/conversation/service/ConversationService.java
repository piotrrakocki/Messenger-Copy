package com.example.messenger.chat.conversation.service;

import com.example.messenger.chat.conversation.DTO.ConversationDTO;
import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.model.ConversationType;
import com.example.messenger.chat.message.DTO.MessageDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ConversationService {

    ConversationDTO findConversation(Authentication authentication, Long userId2);

    Conversation createConversation(ConversationType type, Long themeId, Long emojiId, List<Long> userIds, Authentication authentication);

    List<ConversationDTO> getConversationsByUserId(Authentication authentication);

    String updateTitle(Authentication authentication, MessageDTO messageDTO, Long conversationId, String title);

    void updateImageData(Authentication authentication, MessageDTO messageDTO, Long conversationId, byte[] imageData);
}
