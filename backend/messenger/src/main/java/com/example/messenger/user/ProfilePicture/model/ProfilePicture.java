package com.example.messenger.user.ProfilePicture.model;

import com.example.messenger.user.model.AppUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(exclude = "appUser")
@NoArgsConstructor
public class ProfilePicture {

    @Id
    @SequenceGenerator(name = "profile_picture_sequence", sequenceName = "profile_picture_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profile_picture_sequence")
    private Long id;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] imageData;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser appUser;

    public ProfilePicture(byte[] imageData, AppUser appUser) {
        this.imageData = imageData;
        this.appUser = appUser;
    }
}
