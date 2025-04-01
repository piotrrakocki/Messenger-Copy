package com.example.messenger.chat.conversation.theme.service;

import com.example.messenger.chat.conversation.theme.model.Theme;
import com.example.messenger.chat.message.DTO.MessageDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ThemeService {

    Theme findById(Long id);

    List<Theme> findAll();

    void updateConversationTheme(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long themeId);
}
