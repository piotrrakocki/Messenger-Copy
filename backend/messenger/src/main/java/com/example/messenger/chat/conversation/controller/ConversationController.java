package com.example.messenger.chat.conversation.controller;

import com.example.messenger.chat.conversation.DTO.ConversationDTO;
import com.example.messenger.chat.conversation.DTO.UpdateImageDataDTO;
import com.example.messenger.chat.conversation.DTO.UpdateTitleDTO;
import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversation.model.ConversationType;
import com.example.messenger.chat.conversation.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping("/find")
    public ResponseEntity<ConversationDTO> findConversation(Authentication authentication, @RequestParam Long userId2) {
        return ResponseEntity.ok(conversationService.findConversation(authentication, userId2));
    }

    @PostMapping("/create")
    public ResponseEntity<Conversation> createConversation(
            Authentication authentication,
            @RequestParam ConversationType type,
            @RequestParam Long themeId,
            @RequestParam Long emojiId,
            @RequestParam List<Long> userIds
            ) {
        return ResponseEntity.ok(conversationService.createConversation(type, themeId, emojiId, userIds, authentication));
    }

    @GetMapping("/findByUser")
    public ResponseEntity<List<ConversationDTO>> getConversationsByUserId(Authentication authentication) {
        return ResponseEntity.ok(conversationService.getConversationsByUserId(authentication));
    }

    @PutMapping("/{conversationId}/title")
    public ResponseEntity<String> updateTitle(Authentication authentication, @RequestBody UpdateTitleDTO updateTitleDTO, @PathVariable Long conversationId) {
        return ResponseEntity.ok(conversationService.updateTitle(authentication, updateTitleDTO.messageDTO(), conversationId, updateTitleDTO.newTitle()));
    }

    @PutMapping("/{conversationId}/imageData")
    public ResponseEntity<String> updateImageData(Authentication authentication, @RequestBody UpdateImageDataDTO updateImageDataDTO, @PathVariable Long conversationId) {
        conversationService.updateImageData(authentication, updateImageDataDTO.messageDTO(), conversationId, updateImageDataDTO.imageData());
        return ResponseEntity.ok(("ImageData updated successfully"));
    }
}
