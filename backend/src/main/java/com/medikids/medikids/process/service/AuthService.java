package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.response.AuthResponse;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${codigo.2fa.expiration}")
    private long codigoExpiracionMs;

    /**
     * Paso 1 del login: Valida credenciales y envía código 2FA por email.
     *
     * @param email    Correo electrónico del usuario
     * @param password Contraseña del usuario
     * @return AuthResponse con mensaje de éxito o null si credenciales inválidas
     */
    public AuthResponse login(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getVisible() != '1') {
            return null;
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return null;
        }

        String codigo = generarCodigo6Digitos();

        usuario.setCodigoVerificacion(codigo);
        usuario.setCodigoExpiracion(new Date(System.currentTimeMillis() + codigoExpiracionMs));
        usuarioRepository.save(usuario);

        emailService.enviarCodigo2FA(email, codigo);

        return AuthResponse.builder()
                .message("Código de verificación enviado al correo: " + ocultarEmail(email))
                .build();
    }

    /**
     * Paso 2 del login: Verifica el código 2FA y genera JWT token.
     *
     * @param email Correo electrónico del usuario
     * @param code  Código de verificación de 6 dígitos
     * @return AuthResponse con JWT token y datos del usuario, o null si código inválido
     */
    public AuthResponse verify2FA(String email, String code) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getCodigoVerificacion() == null || usuario.getCodigoExpiracion() == null) {
            return null;
        }

        if (new Date().after(usuario.getCodigoExpiracion())) {
            usuario.setCodigoVerificacion(null);
            usuario.setCodigoExpiracion(null);
            usuarioRepository.save(usuario);
            return null;
        }

        if (!usuario.getCodigoVerificacion().equals(code)) {
            return null;
        }

        usuario.setCodigoVerificacion(null);
        usuario.setCodigoExpiracion(null);
        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .message("Autenticación exitosa")
                .usuario(UsuarioHelper.mapUsuario(usuario))
                .build();
    }

    /**
     * Genera un código numérico aleatorio de 6 dígitos usando SecureRandom.
     */
    private String generarCodigo6Digitos() {
        SecureRandom random = new SecureRandom();
        int codigo = 100000 + random.nextInt(900000);
        return String.valueOf(codigo);
    }

    /**
     * Oculta parcialmente el email para mostrar en la respuesta.
     * Ejemplo: d****o@gmail.com
     */
    private String ocultarEmail(String email) {
        String[] parts = email.split("@");
        if (parts[0].length() <= 2) {
            return "**@" + parts[1];
        }
        return parts[0].charAt(0)
                + "*".repeat(parts[0].length() - 2)
                + parts[0].charAt(parts[0].length() - 1)
                + "@" + parts[1];
    }
}
