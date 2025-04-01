package com.example.messenger.chat.conversation.emoji.service;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import com.example.messenger.chat.conversation.emoji.repository.EmojiRepository;
import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.repository.ConversationRepository;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.service.MessageService;
import com.example.messenger.exceptions.ConversationNotFoundException;
import com.example.messenger.exceptions.EmojiNotFoundException;
import com.example.messenger.exceptions.UserNotFoundException;
import com.example.messenger.user.model.AppUser;
import com.example.messenger.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmojiServiceImpl implements EmojiService {

    private final EmojiRepository emojiRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageService messageService;

    @Override
    public Emoji findById(Long id) {
        return emojiRepository.findById(id)
                .orElseThrow(() -> new EmojiNotFoundException("Emoji with id: " + id + " not found."));
    }

    @Override
    public List<Emoji> findAll() {
        return emojiRepository.findAll();
    }

    @Transactional
    @Override
    public void updateConversationEmoji(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long emojiId) {
        Conversation conversation = getConversation(conversationId);
        Emoji emoji = findById(emojiId);
        conversation.setEmoji(emoji);

        messageService.sendMessage(messageDTO, authentication);
    }

    private Conversation getConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation with id: " + conversationId + " not found."));
        return conversation;
    }

    private AppUser findUserByAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User with username: " + username + " not found."));
    }
}
