package com.example.messenger.chat.conversation.service;

import com.example.messenger.chat.conversation.DTO.ConversationDTO;
import com.example.messenger.chat.conversation.emoji.service.EmojiService;
import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.model.ConversationType;
import com.example.messenger.chat.conversation.repository.ConversationRepository;
import com.example.messenger.chat.conversation.theme.service.ThemeService;
import com.example.messenger.chat.conversationParticipant.model.ParticipantRole;
import com.example.messenger.chat.conversationParticipant.repository.ConversationParticipantRepository;
import com.example.messenger.chat.conversationParticipant.service.ConversationParticipantService;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.service.MessageService;
import com.example.messenger.exceptions.ConversationNotFoundException;
import com.example.messenger.exceptions.UserNotFoundException;
import com.example.messenger.user.ProfilePicture.model.ProfilePicture;
import com.example.messenger.user.model.AppUser;
import com.example.messenger.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository conversationParticipantRepository;
    private final UserRepository userRepository;
    private final ConversationParticipantService conversationParticipantService;
    private final MessageService messageService;
    private final EmojiService emojiService;
    private final ThemeService themeService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public ConversationDTO findConversation(Authentication authentication, Long userId2) {
        Long userId1 = findUserByAuthentication(authentication).getId();
        ConversationDTO conversation = conversationRepository.findPrivateConversationBetweenUsers(userId1, userId2).orElseThrow(
                () -> new ConversationNotFoundException("Conversation with userId1 " + userId1 + ", userId2 " + userId2 + " not found.")
        );
        String dynamicTitle = getDynamicTitle(conversation.id(), userId1);
        byte[] dynamicImageData = getDynamicImageData(conversation, userId1);

        return new ConversationDTO(
                conversation.id(),
                conversation.type(),
                dynamicTitle,
                dynamicImageData,
                conversation.theme(),
                conversation.emoji(),
                conversation.createdAt(),
                conversation.updatedAt()
        );
    }

    @Override
    public Conversation createConversation(ConversationType type, Long themeId, Long emojiId, List<Long> userIds, Authentication authentication) {
        Long userId = findUserByAuthentication(authentication).getId();

        Conversation conversation = conversationRepository.save(Conversation.builder()
                .type(type)
                .theme(themeService.findById(themeId))
                .emoji(emojiService.findById(emojiId))
                .createdAt(LocalDateTime.now())
                .build());

        if (userIds.size() > 1) {
            conversationParticipantService.addParticipant(userId, ParticipantRole.ADMIN, conversation);
        } else {
            conversationParticipantService.addParticipant(userId, ParticipantRole.MEMBER, conversation);
        }

        for (int i=0; i<userIds.size(); i++) {
            conversationParticipantService.addParticipant(userIds.get(i), ParticipantRole.MEMBER, conversation);
        }

        return conversation;
    }

    @Override
    public List<ConversationDTO> getConversationsByUserId(Authentication authentication) {
        Long userId = findUserByAuthentication(authentication).getId();

        List<ConversationDTO> conversations = conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);

        return conversations.stream().map(conversation -> {
            String dynamicTitle = (conversation.title() == null || conversation.title().isEmpty())
                    ? getDynamicTitle(conversation.id(), userId)
                    : conversation.title();
            byte[] dynamicImageData = conversation.imageData() == null
                    ? getDynamicImageData(conversation, userId)
                    : conversation.imageData();
                return new ConversationDTO(
                        conversation.id(),
                        conversation.type(),
                        dynamicTitle,
                        dynamicImageData,
                        conversation.theme(),
                        conversation.emoji(),
                        conversation.createdAt(),
                        conversation.updatedAt()
                );
        }).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public String updateTitle(Authentication authentication, MessageDTO messageDTO, Long conversationId, String title) {
        Long userId = findUserByAuthentication(authentication).getId();
        Conversation conversation = getConversation(conversationId);
        conversation.setTitle(title);

        messageService.sendMessage(messageDTO, authentication);

        if (title == null) {
            return getDynamicTitle(conversationId, userId);
        } else {
            return title;
        }
    }

    @Transactional
    @Override
    public void updateImageData(Authentication authentication, MessageDTO messageDTO, Long conversationId, byte[] imageData) {
        Conversation conversation = getConversation(conversationId);
        conversation.setImageData(imageData);

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

    private String getDynamicTitle(Long conversationId, Long currentUserId) {
        return conversationParticipantRepository.findParticipantNames(conversationId)
                .stream()
                .filter(participant -> !participant.getId().equals(currentUserId))
                .map(AppUser::getFullName)
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        participantNames -> {
                            if (participantNames.isEmpty()) {
                                return "Unknown";
                            } else if (participantNames.size() == 1) {
                                return participantNames.getFirst();
                            } else {
                                return String.join(", ", participantNames);
                            }
                        }
                ));
    }

    private byte[] getDynamicImageData(ConversationDTO conversation, Long currentUserId) {
        return conversationParticipantRepository.findParticipantNames(conversation.id())
                .stream()
                .filter(participant -> !participant.getId().equals(currentUserId))
                .map(AppUser::getProfilePicture)
                .filter(Objects::nonNull)
                .map(ProfilePicture::getImageData)
                .findFirst()
                .orElse(null);
    }
}
