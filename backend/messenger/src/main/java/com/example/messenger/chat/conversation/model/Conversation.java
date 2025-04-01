package com.example.messenger.chat.conversation.model;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import com.example.messenger.chat.conversation.theme.model.Theme;
import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.chat.message.model.Message;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ConversationType type;

    private String title;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "theme_id", referencedColumnName = "id")
    private Theme theme;

    @ManyToOne
    @JoinColumn(name = "emoji_id", referencedColumnName = "id")
    private Emoji emoji;

    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConversationParticipant> participants;
}
