package com.example.messenger.chat.message.controller;

import com.example.messenger.chat.conversationParticipant.DTO.ReadEvent;
import com.example.messenger.chat.conversationParticipant.DTO.ReadUpdateEvent;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.chat.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @MessageMapping("/sendMessage")
    public MessageDTO sendMessage(@Payload MessageDTO message, Authentication authentication) {
        return messageService.sendMessage(message, authentication);
    }

    @MessageMapping("/conversation/{conversationId}/read")
    public ReadUpdateEvent handleReadMessage(@DestinationVariable Long conversationId, @Payload ReadEvent readEvent) {
        return messageService.readMessage(conversationId, readEvent);
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public MessageDTO addUser(@Payload MessageDTO message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message);
        return message;
    }

    @GetMapping("/conversation/{conversationId}")
    public Page<MessageDTO> getMessages(@PathVariable Long conversationId, @RequestParam int page, @RequestParam int size) {
        return messageService.getMessagesByConversationId(conversationId, page, size);
    }
}
