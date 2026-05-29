package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.response.AuthResponse;
import com.medikids.medikids.process.domain.RefreshToken;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.service.IpAutorizadaService;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.IpUtils;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IpAutorizadaService ipAutorizadaService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${codigo.2fa.expiration}")
    private long codigoExpiracionMs;

    // ── 2FA DESACTIVADO ────────────────────────────────────────────────────
    // Para reactivar 2FA:
    //   1. Descomentar el método login() de abajo
    //   2. Comentar el método login() actual que retorna token directo
    //   3. En el frontend LoginPage.jsx, descomentar las secciones /* 2FA */
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Login SIN 2FA: valida credenciales y retorna JWT directamente.
     * Rechaza usuarios con rol=3 (deben usar la ruta administrativa secreta).
     */
    public AuthResponse login(String email, String password, HttpServletRequest httpRequest) {
        String clientIp = IpUtils.getClientIp(httpRequest);
        String fingerprint = computeFingerprint(httpRequest);

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getVisible() != '1' || Boolean.FALSE.equals(usuario.getActivo())) {
            return null;
        }

        if (usuario.getId_rol() == 3 || usuario.getId_rol() == 4) {
            return null;
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return null;
        }

        String token = jwtService.generateToken(usuario);

        String refreshToken = refreshTokenService.createRefreshToken(usuario.getId_usuario(), fingerprint, clientIp).getToken();

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .message("Inicio de sesión exitoso")
                .usuario(UsuarioHelper.mapUsuario(usuario))
                .build();
    }

    /**
     * Login exclusivo para administradores (rol=3).
     * Verifica IP, genera token de corta duración y registra auditoría.
     */
    public AuthResponse adminLogin(String email, String password, HttpServletRequest httpRequest) {
        String clientIp = IpUtils.getClientIp(httpRequest);
        String fingerprint = computeFingerprint(httpRequest);

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            auditService.registrarIntento(email, clientIp, false, "ADMIN");
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getVisible() != '1' || Boolean.FALSE.equals(usuario.getActivo()) || (usuario.getId_rol() != 3 && usuario.getId_rol() != 4)) {
            auditService.registrarIntento(email, clientIp, false, "ADMIN");
            return null;
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            auditService.registrarIntento(email, clientIp, false, "ADMIN");
            return null;
        }

        String token = jwtService.generateAdminToken(usuario);
        auditService.registrarIntento(email, clientIp, true, "ADMIN");

        String refreshToken = refreshTokenService.createRefreshToken(usuario.getId_usuario(), fingerprint, clientIp).getToken();

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .message("Acceso administrativo autorizado")
                .usuario(UsuarioHelper.mapUsuario(usuario))
                .build();
    }

    /*
    // ── Login CON 2FA ─────────────────────────────────────────────────────
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

        if (!ipAutorizadaService.isIpAutorizada(usuario.getId_usuario(), ipCliente)) {
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
    // ──────────────────────────────────────────────────────────────────────*/

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

    public AuthResponse resend2FA(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) return null;

        Usuario usuario = usuarioOpt.get();
        String codigo = generarCodigo6Digitos();

        usuario.setCodigoVerificacion(codigo);
        usuario.setCodigoExpiracion(new Date(System.currentTimeMillis() + codigoExpiracionMs));
        usuarioRepository.save(usuario);

        emailService.enviarCodigo2FA(email, codigo);

        return AuthResponse.builder()
                .message("Código reenviado al correo: " + ocultarEmail(email))
                .build();
    }

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

    // ── Refresh Token ─────────────────────────────────────────────────────

    public AuthResponse refreshToken(String refreshTokenValue, HttpServletRequest httpRequest) {
        String currentFingerprint = computeFingerprint(httpRequest);
        String currentIp = IpUtils.getClientIp(httpRequest);

        Optional<RefreshToken> optRt = refreshTokenService.findByToken(refreshTokenValue);
        if (optRt.isEmpty()) return null;

        RefreshToken rt = optRt.get();

        if (rt.isRevoked()) {
            refreshTokenService.revokeAllUserTokens(rt.getIdUsuario());
            return null;
        }

        if (rt.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            return null;
        }

        if (!refreshTokenService.isSessionValid(rt, currentFingerprint, currentIp)) {
            refreshTokenService.revokeAllUserTokens(rt.getIdUsuario());
            return null;
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(rt.getIdUsuario());
        if (usuarioOpt.isEmpty()) return null;

        Usuario usuario = usuarioOpt.get();
        if (usuario.getVisible() != '1' || Boolean.FALSE.equals(usuario.getActivo())) {
            return null;
        }

        String newToken = jwtService.generateToken(usuario);

        refreshTokenService.revokeToken(refreshTokenValue);
        String newRefreshToken = refreshTokenService.createRefreshToken(usuario.getId_usuario(), currentFingerprint, currentIp).getToken();

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .message("Token renovado exitosamente")
                .usuario(UsuarioHelper.mapUsuario(usuario))
                .build();
    }

    public boolean logout(String refreshTokenValue) {
        Optional<RefreshToken> optRt = refreshTokenService.findByToken(refreshTokenValue);
        if (optRt.isEmpty()) return false;

        refreshTokenService.revokeAllUserTokens(optRt.get().getIdUsuario());
        return true;
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private String computeFingerprint(HttpServletRequest request) {
        try {
            String ua = request.getHeader("User-Agent");
            String lang = request.getHeader("Accept-Language");
            String ip = IpUtils.getClientIp(request);
            String raw = (ua != null ? ua : "") + "||" + (lang != null ? lang : "") + "||" + (ip != null ? ip : "");
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(64);
            for (byte b : hash) {
                hex.append(String.format("%02x", b & 0xff));
            }
            return hex.toString();
        } catch (Exception e) {
            log.warn("Error al calcular fingerprint: {}", e.getMessage());
            return null;
        }
    }

}
