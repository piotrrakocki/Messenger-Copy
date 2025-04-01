package com.example.messenger.user.ProfilePicture.repository;

import com.example.messenger.user.ProfilePicture.model.ProfilePicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, Long> {

    @Query("SELECT p FROM ProfilePicture p WHERE p.appUser.id IN :ids")
    List<ProfilePicture> findByUserIds(@Param("ids") List<Long> ids);
}
