package com.example.messenger.chat.conversation.emoji.controller;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import com.example.messenger.chat.conversation.emoji.service.EmojiService;
import com.example.messenger.chat.message.DTO.MessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/emoji")
@RequiredArgsConstructor
public class EmojiController {

    private final EmojiService emojiService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Emoji>> findAll() {
        return ResponseEntity.ok(emojiService.findAll());
    }

    @PutMapping("/{conversationId}/emoji/{emojiId}")
    public ResponseEntity<String> updateEmoji(Authentication authentication, @RequestBody MessageDTO messageDTO, @PathVariable Long conversationId, @PathVariable Long emojiId) {
        emojiService.updateConversationEmoji(authentication, messageDTO, conversationId, emojiId);
        return ResponseEntity.ok("Emoji updated successfully");
    }
}
