package com.example.messenger.chat.conversationParticipant.model;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.message.model.Message;
import com.example.messenger.user.model.AppUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ConversationParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    private String nickname;

    private LocalDateTime joinedAt;

    @Enumerated(EnumType.STRING)
    private ParticipantRole role;

    @ManyToOne
    @JoinColumn(name = "last_read_message_id")
    private Message lastReadMessage;
}
