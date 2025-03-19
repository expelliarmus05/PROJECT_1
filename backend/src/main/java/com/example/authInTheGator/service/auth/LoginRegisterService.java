package com.example.authInTheGator.service.auth;

import com.example.authInTheGator.dto.RegistrationRequest;
import com.example.authInTheGator.entity.AuthUser;
import com.example.authInTheGator.entity.enums.Role;
import com.example.authInTheGator.repository.AuthUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class LoginRegisterService implements UserDetailsService {
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginRegisterService(AuthUserRepository authUserRepository, PasswordEncoder passwordEncoder) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Fetch the user from the database
        AuthUser authUser = authUserRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        // Convert roles to an array of strings
        String[] roles = authUser.getRoles()
                .stream()
                .map(Enum::name)
                .toArray(String[]::new);

        // Build and return a UserDetails object
        return User.withUsername(authUser.getUsername())
                .password(authUser.getPassword())
                .roles(roles)
                .build();
    }
    public void registerUser(RegistrationRequest registrationRequest) {
        // Check if the username or email already exists
        if (authUserRepository.findByUsernameOrEmail(registrationRequest.getUsername(), registrationRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username or email already exists");
        }

        // Create a new user
        AuthUser authUser = new AuthUser();
        authUser.setFirstName(registrationRequest.getFirstName());
        authUser.setLastName(registrationRequest.getLastName());
        authUser.setUsername(registrationRequest.getUsername());
        authUser.setEmail(registrationRequest.getEmail());
        authUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        authUser.setRoles(Set.of(Role.USER)); // Assign default role

        // Save the user
        authUserRepository.save(authUser);
    }
}
