package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.response.AuthResponse;
import com.medikids.medikids.expose.model.request.LoginRequest;
import com.medikids.medikids.expose.model.request.VerifyCodeRequest;
import com.medikids.medikids.process.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private final AuthService authService;

    /**
     * Paso 1: El usuario envía email y password.
     * Si las credenciales son válidas, se genera un código de 6 dígitos
     * y se envía al correo del usuario.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword(), extraerIpCliente(httpServletRequest));

        if (Objects.nonNull(response)) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.builder()
                .message("Credenciales inválidas, usuario desactivado o IP no autorizada")
                        .build());
    }

    /**
     * Paso 2: El usuario envía el código de verificación recibido por email.
     * Si el código es válido y no ha expirado, se genera un JWT token.
     */
    @PostMapping("/verify-2fa")
    public ResponseEntity<AuthResponse> verify2FA(@RequestBody VerifyCodeRequest request) {
        AuthResponse response = authService.verify2FA(request.getEmail(), request.getCode());

        if (Objects.nonNull(response)) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.builder()
                        .message("Código de verificación inválido o expirado")
                        .build());
    }

    @PostMapping("/resend-2fa")
    public ResponseEntity<AuthResponse> resend2FA(@RequestBody com.medikids.medikids.expose.model.request.LoginRequest request) {
        AuthResponse response = authService.resend2FA(request.getEmail());

        if (Objects.nonNull(response)) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(AuthResponse.builder()
                        .message("No se pudo reenviar el código")
                        .build());
    }

    private String extraerIpCliente(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}
