package com.example.messenger.chat.conversation.emoji.repository;

import com.example.messenger.chat.conversation.emoji.model.Emoji;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji, Long> {
}
