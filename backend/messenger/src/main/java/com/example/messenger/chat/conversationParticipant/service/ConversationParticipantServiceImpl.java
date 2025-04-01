package com.example.messenger.chat.conversationParticipant.service;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.repository.ConversationRepository;
import com.example.messenger.chat.conversationParticipant.DTO.ConversationParticipantDTO;
import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.chat.conversationParticipant.model.ParticipantRole;
import com.example.messenger.chat.conversationParticipant.repository.ConversationParticipantRepository;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.service.MessageService;
import com.example.messenger.exceptions.ConversationNotFoundException;
import com.example.messenger.exceptions.OperationNotAllowedException;
import com.example.messenger.exceptions.ParticipantNotFoundException;
import com.example.messenger.exceptions.UserNotFoundException;
import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import com.example.messenger.user.model.AppUser;
import com.example.messenger.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationParticipantServiceImpl implements ConversationParticipantService {

    private final ConversationParticipantRepository participantRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageService messageService;

    @Override
    public ConversationParticipant addParticipant(Long userId, ParticipantRole role, Conversation conversation) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with id: " + userId + " not found."));

        ConversationParticipant conversationParticipant = new ConversationParticipant();
        conversationParticipant.setUser(user);
        conversationParticipant.setConversation(conversation);
        conversationParticipant.setJoinedAt(LocalDateTime.now());
        conversationParticipant.setRole(role);

        return participantRepository.save(conversationParticipant);
    }

    @Override
    public List<ConversationParticipantDTO> addParticipants(Authentication authentication, MessageDTO messageDTO, List<UserNameAndPictureDTO> userNameAndPictureDTOS, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation with id: " + conversationId + " not found."));

        Long currentId = findUserByAuthentication(authentication).getId();

        ConversationParticipant currentParticipant = participantRepository
                .findByUserIdAndConversationId(currentId, conversationId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with userId: " + currentId + ", conversationId: " + conversationId + " not found."));

        if (currentParticipant.getRole() == ParticipantRole.MEMBER) {
            throw new OperationNotAllowedException("You don't have permission to add new participants.");
        }

        List<ConversationParticipantDTO> addedParticipants = new ArrayList<>();

        for (UserNameAndPictureDTO users : userNameAndPictureDTOS) {
            AppUser user = userRepository.findById(users.id())
                    .orElseThrow(() -> new UserNotFoundException("User with id: " + users.id() + " not found."));

            ConversationParticipant conversationParticipant = new ConversationParticipant();
            conversationParticipant.setUser(user);
            conversationParticipant.setConversation(conversation);
            conversationParticipant.setJoinedAt(LocalDateTime.now());
            conversationParticipant.setRole(ParticipantRole.MEMBER);

            participantRepository.save(conversationParticipant);
            addedParticipants.add(ConversationParticipantDTO.fromEntity(conversationParticipant));
        }

        messageService.sendMessage(messageDTO, authentication);

        return addedParticipants;
    }

    @Override
    public List<ConversationParticipantDTO> getParticipantsByConversationId(Long conversationId) {
        List<ConversationParticipant> conversationParticipants = participantRepository.findByConversationId(conversationId);

        return conversationParticipants.stream()
                .map(participant -> new ConversationParticipantDTO(
                        participant.getId(),
                        participant.getUser().getId(),
                        participant.getUser().getFullName(),
                        participant.getUser().getProfilePicture() != null
                                ? participant.getUser().getProfilePicture().getImageData()
                                : null,
                        participant.getConversation().getId(),
                        participant.getNickname(),
                        participant.getJoinedAt(),
                        participant.getRole(),
                        participant.getLastReadMessage() != null ? participant.getLastReadMessage().getId() : null
                )).toList();
    }

    @Override
    public ConversationParticipantDTO editNickname(Authentication authentication, MessageDTO messageDTO, Long participantId, String nickname) {
        ConversationParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with participantId: " + participantId + " not found."));

        participant.setNickname(nickname);
        participantRepository.save(participant);

        messageService.sendMessage(messageDTO, authentication);

        return new ConversationParticipantDTO(
                participantId,
                participant.getUser().getId(),
                participant.getUser().getFullName(),
                participant.getConversation().getImageData(),
                participant.getConversation().getId(),
                nickname,
                participant.getJoinedAt(),
                participant.getRole(),
                participant.getLastReadMessage() != null
                        ? participant.getLastReadMessage().getId()
                        : null
        );
    }

    @Transactional
    @Override
    public ConversationParticipantDTO changeRole(Authentication authentication, Long conversationId, Long participantId, ParticipantRole role) {
        Long currentId = findUserByAuthentication(authentication).getId();

        ConversationParticipant currentParticipant = participantRepository
                .findByUserIdAndConversationId(currentId, conversationId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with userId: " + currentId + ", conversationId: " + conversationId + " not found."));

        if (currentParticipant.getRole() == ParticipantRole.MEMBER) {
            throw new OperationNotAllowedException("You don't have permission to add new participants.");
        }

        ConversationParticipant conversationParticipant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with id: " + participantId + " notFound."));
        conversationParticipant.setRole(role);

        return ConversationParticipantDTO.fromEntity(conversationParticipant);
    }

    @Transactional
    @Override
    public void removeParticipant(Authentication authentication, MessageDTO messageDTO, Long conversationId, Long participantId) {
        Long currentId = findUserByAuthentication(authentication).getId();

        ConversationParticipant currentParticipant = participantRepository
                .findByUserIdAndConversationId(currentId, conversationId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with userId: " + currentId + ", conversationId: " + conversationId + " not found."));

        if (currentParticipant.getRole() == ParticipantRole.MEMBER) {
            throw new OperationNotAllowedException("You don't have permission to remove participants.");
        }

        participantRepository.deleteById(participantId);

        messageService.sendMessage(messageDTO, authentication);
    }

    private AppUser findUserByAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User with username: " + username + " not found."));
    }
}
