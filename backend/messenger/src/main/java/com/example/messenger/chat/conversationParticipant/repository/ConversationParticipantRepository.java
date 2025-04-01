package com.example.messenger.chat.conversationParticipant.repository;

import com.example.messenger.chat.conversation.model.Conversation;
import com.example.messenger.chat.conversationParticipant.model.ConversationParticipant;
import com.example.messenger.user.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {

    @Query("SELECT p.user FROM ConversationParticipant p WHERE p.conversation.id = :conversationId")
    List<AppUser> findParticipantNames(@Param("conversationId") Long conversationId);

    List<ConversationParticipant> findByConversationId(Long conversationId);

    ConversationParticipant findByUserAndConversation(AppUser user, Conversation conversation);

    Optional<ConversationParticipant> findByUserIdAndConversationId(Long userId, Long conversationId);
}
