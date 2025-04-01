package com.example.messenger.chat.conversation.theme.controller;

import com.example.messenger.chat.conversation.theme.model.Theme;
import com.example.messenger.chat.conversation.theme.service.ThemeService;
import com.example.messenger.chat.message.DTO.MessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/theme")
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeService themeService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Theme>> findAll() {
        return ResponseEntity.ok(themeService.findAll());
    }

    @PutMapping("/{conversationId}/theme/{themeId}")
    public ResponseEntity<String> updateTheme(Authentication authentication, @RequestBody MessageDTO messageDTO, @PathVariable Long conversationId, @PathVariable Long themeId) {
        themeService.updateConversationTheme(authentication, messageDTO, conversationId, themeId);
        return ResponseEntity.ok("Theme updated successfully");
    }
}
