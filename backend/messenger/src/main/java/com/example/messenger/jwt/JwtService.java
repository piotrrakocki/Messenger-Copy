package com.example.messenger.jwt;

import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.Claims;
import java.util.Map;
import java.util.function.Function;

public interface JwtService {

    String extractUserName(String token);

    <T> T extractClaims(String token, Function<Claims, T> claimsResolver);

    String generateToken(UserDetails userDetails);

    String generateToken(Map<String, Object> extractClaims, UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);
}
