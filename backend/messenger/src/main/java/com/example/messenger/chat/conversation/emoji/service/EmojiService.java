package com.example.messenger.chat.conversation.emoji.service;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import com.example.messenger.chat.message.DTO.MessageDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface EmojiService {

    Emoji findById(Long id);

    List<Emoji> findAll();

    void updateConversationEmoji(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long emojiId);
}
