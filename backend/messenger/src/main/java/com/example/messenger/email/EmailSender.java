package com.example.messenger.email;

public interface EmailSender {

    void send(String to, String email, String subject);
}
