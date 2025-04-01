package com.example.messenger.chat.conversation.repository;

import com.example.messenger.chat.conversation.DTO.ConversationDTO;
import com.example.messenger.chat.conversation.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT new com.example.messenger.chat.conversation.DTO.ConversationDTO( " +
            "c.id, c.type, c.title, c.imageData, c.theme, c.emoji, c.createdAt, c.updatedAt) " +
            "FROM Conversation c " +
            "JOIN c.participants p1 " +
            "JOIN c.participants p2 " +
            "WHERE p1.user.id = :userId1 " +
            "AND p2.user.id = :userId2 " +
            "AND SIZE(c.participants) = 2")
    Optional<ConversationDTO> findPrivateConversationBetweenUsers(Long userId1, Long userId2);

    @Query("SELECT new com.example.messenger.chat.conversation.DTO.ConversationDTO( " +
            "c.id, c.type, c.title, c.imageData, c.theme, c.emoji, c.createdAt, c.updatedAt) " +
            "FROM Conversation c " +
            "JOIN c.participants p " +
            "WHERE p.user.id = :userId " +
            "ORDER BY c.updatedAt DESC")
    List<ConversationDTO> findByUserIdOrderByUpdatedAtDesc(@Param("userId") Long userId);
}
