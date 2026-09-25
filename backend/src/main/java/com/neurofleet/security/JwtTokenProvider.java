package com.neurofleet.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JWT Token Provider for NeuroFleet Platform.
 * 
 * Handles JWT token creation, validation, and extraction.
 * Uses HMAC-SHA256 for signing with a configurable secret key.
 * Tokens contain subject (username), role claims, and expiration.
 */
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a JWT token for an authenticated user.
     * Includes role information as a custom claim.
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Extract role from authorities
        String role = userDetails.getAuthorities().stream()
            .findFirst()
            .map(a -> a.getAuthority())
            .orElse("ROLE_VIEWER");

        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("role", role)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * Extract username from JWT token.
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }

    /**
     * Validate JWT token integrity and expiration.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            // Invalid signature or malformed token
        } catch (ExpiredJwtException e) {
            // Token has expired
        } catch (UnsupportedJwtException e) {
            // Unsupported token format
        } catch (IllegalArgumentException e) {
            // Empty or null token
        }
        return false;
    }
}
