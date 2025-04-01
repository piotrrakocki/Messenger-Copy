package com.example.messenger.chat.message.service;

import com.example.messenger.chat.conversationParticipant.DTO.ReadEvent;
import com.example.messenger.chat.conversationParticipant.DTO.ReadUpdateEvent;
import com.example.messenger.chat.message.DTO.MessageDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;


public interface MessageService {
    MessageDTO sendMessage(MessageDTO messageDTO, Authentication authentication);

    ReadUpdateEvent readMessage(Long conversationId, ReadEvent readEvent);

    Page<MessageDTO> getMessagesByConversationId(Long conversationId, int page, int size);
}
