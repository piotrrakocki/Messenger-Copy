package com.example.messenger.chat.conversation.theme.repository;

import com.example.messenger.chat.conversation.theme.model.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {
}
