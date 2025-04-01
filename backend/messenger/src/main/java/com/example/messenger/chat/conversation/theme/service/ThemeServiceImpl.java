package com.example.messenger.chat.conversation.theme.service;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.repository.ConversationRepository;
import com.example.messenger.chat.conversation.theme.model.Theme;
import com.example.messenger.chat.conversation.theme.repository.ThemeRepository;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.service.MessageService;
import com.example.messenger.exceptions.ConversationNotFoundException;
import com.example.messenger.exceptions.ThemeNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeServiceImpl implements ThemeService {

    private final ThemeRepository themeRepository;
    private final ConversationRepository conversationRepository;
    private final MessageService messageService;

    @Override
    public Theme findById(Long id) {
        return themeRepository.findById(id)
                .orElseThrow(() -> new ThemeNotFoundException("Theme with id " + id + " not found."));
    }

    @Override
    public List<Theme> findAll() {
        return themeRepository.findAll();
    }

    @Transactional
    @Override
    public void updateConversationTheme(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long themeId) {
        Conversation conversation = getConversation(conversationId);
        Theme theme = findById(themeId);
        conversation.setTheme(theme);

        messageService.sendMessage(messageDTO, authentication);
    }

    private Conversation getConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation with id: " + conversationId + " not found."));
        return conversation;
    }
}
