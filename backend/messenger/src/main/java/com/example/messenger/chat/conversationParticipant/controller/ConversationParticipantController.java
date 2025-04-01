package com.example.messenger.chat.conversationParticipant.controller;

import com.example.messenger.chat.conversationParticipant.DTO.AddParticipantsDTO;
import com.example.messenger.chat.conversationParticipant.DTO.ChangeNicknameRequestDTO;
import com.example.messenger.chat.conversationParticipant.DTO.ConversationParticipantDTO;
import com.example.messenger.chat.conversationParticipant.model.ParticipantRole;
import com.example.messenger.chat.conversationParticipant.service.ConversationParticipantService;
import com.example.messenger.chat.message.DTO.MessageDTO;
import com.example.messenger.user.DTO.UserNameAndPictureDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversation-participant")
@RequiredArgsConstructor
public class ConversationParticipantController {

    private final ConversationParticipantService conversationParticipantService;

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<ConversationParticipantDTO>> getParticipantsByConversationId(@PathVariable Long conversationId) {
        return ResponseEntity.ok(conversationParticipantService.getParticipantsByConversationId(conversationId));
    }

    @PostMapping("/{conversationId}/addParticipants")
    public ResponseEntity<List<ConversationParticipantDTO>> addParticipants(Authentication authentication, @RequestBody AddParticipantsDTO addParticipantsDTO, @PathVariable Long conversationId) {
        return ResponseEntity.ok(conversationParticipantService.addParticipants(authentication, addParticipantsDTO.messageDTO(), addParticipantsDTO.userNameAndPictureDTOS(), conversationId));
    }

    @PatchMapping("/{participantId}/nickname")
    public ResponseEntity<ConversationParticipantDTO> changeNickname(Authentication authentication, @RequestBody ChangeNicknameRequestDTO changeNicknameRequestDTO, @PathVariable Long participantId) {
        return ResponseEntity.ok(conversationParticipantService.editNickname(authentication, changeNicknameRequestDTO.messageDTO(), participantId, changeNicknameRequestDTO.nickname()));
    }

    @PatchMapping("/{conversationId}/{participantId}/changeRole")
    public ResponseEntity<ConversationParticipantDTO> changeRole(Authentication authentication,@PathVariable Long conversationId, @PathVariable Long participantId,@RequestBody ParticipantRole role) {
        return ResponseEntity.ok(conversationParticipantService.changeRole(authentication, conversationId, participantId, role));
    }

    @DeleteMapping("/deleteParticipant/{conversationId}/{participantId}")
    public ResponseEntity<String> deleteParticipant(Authentication authentication, @RequestBody MessageDTO messageDTO, @PathVariable Long conversationId, @PathVariable Long participantId) {
        conversationParticipantService.removeParticipant(authentication, messageDTO, conversationId, participantId);
        return ResponseEntity.ok("Successfully deleted participant.");
    }
}
