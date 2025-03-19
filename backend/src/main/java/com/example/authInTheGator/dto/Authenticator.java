package com.example.authInTheGator.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Authenticator {
    private String accessCode;
    private String refreshToken;
}
