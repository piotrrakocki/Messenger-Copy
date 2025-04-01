package com.example.messenger.chat.message.service;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.repository.ConversationRepository;
import com.example.messenger.chat.conversationParticipant.DTO.ReadEvent;
import com.example.messenger.chat.conversationParticipant.DTO.ReadUpdateEvent;
import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.chat.conversationParticipant.repository.ConversationParticipantRepository;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.model.Message;
import com.example.messenger.chat.message.repository.MessageRepository;
import com.example.messenger.exceptions.ConversationNotFoundException;
import com.example.messenger.exceptions.MessageNotFoundException;
import com.example.messenger.exceptions.ParticipantNotFoundException;
import com.example.messenger.user.ProfilePicture.model.ProfilePicture;
import com.example.messenger.user.model.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationParticipantRepository participantRepository;

    @Override
    public MessageDTO sendMessage(MessageDTO messageDTO, Authentication authentication) {
        Conversation conversation = conversationRepository.findById(messageDTO.conversationId())
                .orElseThrow(() -> new ConversationNotFoundException(("Conversation with conversationId: " + messageDTO.conversationId() + " not found.")));
        AppUser user = (AppUser) authentication.getPrincipal();
        ConversationParticipant participant = participantRepository.findByUserAndConversation(user, conversation);


        Message message = new Message();
        message.setSender(participant);
        message.setContent(messageDTO.content());
        message.setSentAt(LocalDateTime.now());
        message.setConversation(conversation);
        message.setMsgType(messageDTO.msgType());

        Message savedMessage  = messageRepository.save(message);

        byte[] imageData = Optional.ofNullable(savedMessage.getSender())
                .map(ConversationParticipant::getUser)
                .map(AppUser::getProfilePicture)
                .map(ProfilePicture::getImageData)
                .orElse(null);

        MessageDTO responseDTO = new MessageDTO(
                savedMessage.getId(),
                savedMessage.getSender().getId(),
                savedMessage.getSender().getNickname(),
                imageData,
                savedMessage.getConversation().getId(),
                savedMessage.getContent(),
                savedMessage.getMsgType(),
                savedMessage.getSentAt()
        );

        messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversation.getId(),
                responseDTO
        );

        return responseDTO;
    }

    @Transactional
    @Override
    public ReadUpdateEvent readMessage(Long conversationId, ReadEvent readEvent) {
        ConversationParticipant participant = participantRepository.findById(readEvent.participantId())
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with id: " + readEvent.participantId() + " not found."));

        Message newLastReadMsg = messageRepository.findById(readEvent.messageId())
                .orElseThrow(() -> new MessageNotFoundException("Message with id: " + readEvent.messageId() + " not found."));

        ReadUpdateEvent readUpdateEvent = new ReadUpdateEvent(participant.getId(), newLastReadMsg.getId());

        if (participant.getLastReadMessage() == null || newLastReadMsg.getId() > participant.getLastReadMessage().getId()) {
            participant.setLastReadMessage(newLastReadMsg);

            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId,
                    readUpdateEvent
            );
        }

        return readUpdateEvent;
    }

    @Override
    public Page<MessageDTO> getMessagesByConversationId(Long conversationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt"));
        Page<Message> messages = messageRepository.findByConversationId(conversationId, pageable);

        return messages.map(message -> {
            ConversationParticipant sender = message.getSender();
            byte[] imageData = null;

            if (sender.getUser().getProfilePicture() != null) {
                imageData = sender.getUser().getProfilePicture().getImageData();
            }

            return new MessageDTO(
                    message.getId(),
                    sender.getId(),
                    sender.getUser().getFullName(),
                    imageData,
                    message.getConversation().getId(),
                    message.getContent(),
                    message.getMsgType(),
                    message.getSentAt()
            );
        });
    }
}
