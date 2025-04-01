package com.example.messenger.chat.conversation.emoji.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Emoji {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;

    private String description;

    @Enumerated(EnumType.STRING)
    private EmojiCategory emojiCategory;
}
