package com.example.messenger.user.repository;

import com.example.messenger.user.DTO.UserNameDTO;
import com.example.messenger.user.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<UserNameDTO> findFirstAndLastNameByEmail(String email);

    @Query("SELECT new com.example.messenger.user.DTO.UserNameDTO(u.id, u.firstName, u.lastName) " +
            "FROM AppUser u " +
            "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<UserNameDTO> searchByFirstNameOrLastName(@Param("query") String query);

    @Transactional
    @Modifying
    @Query("UPDATE AppUser u " +
            "SET u.enabled = TRUE " +
            "WHERE u.email = ?1")
    int enableAppUser(String email);
}
