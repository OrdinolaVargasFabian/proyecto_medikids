package com.medikids.medikids.process.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envía un correo electrónico con el código de verificación 2FA.
     * El correo tiene un diseño HTML profesional con el branding de Medikids.
     *
     * @param destinatario Email del usuario destino
     * @param codigo       Código de 6 dígitos para verificación
     */
    public void enviarCodigo2FA(String destinatario, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("🔐 Medikids - Código de Verificación");
            helper.setText(buildHtmlTemplate(codigo), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de verificación: " + e.getMessage(), e);
        }
    }

    /**
     * Construye el template HTML del correo con diseño profesional.
     */
    private String buildHtmlTemplate(String codigo) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0; padding:0; background-color:#f4f7fa; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fa; padding:40px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="480" cellspacing="0" cellpadding="0"
                                       style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.08); overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding:32px 40px; text-align:center;">
                                            <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:1px;">
                                                🏥 Medikids
                                            </h1>
                                            <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">
                                                Verificación de Seguridad
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:40px;">
                                            <p style="color:#374151; font-size:16px; margin:0 0 8px; font-weight:600;">
                                                ¡Hola! 👋
                                            </p>
                                            <p style="color:#6b7280; font-size:14px; line-height:1.6; margin:0 0 28px;">
                                                Hemos recibido una solicitud de inicio de sesión en tu cuenta.
                                                Utiliza el siguiente código para completar la verificación:
                                            </p>

                                            <!-- Código -->
                                            <div style="background:linear-gradient(135deg, #f0f4ff 0%%, #e8ecff 100%%); border:2px dashed #667eea; border-radius:12px; padding:24px; text-align:center; margin:0 0 28px;">
                                                <p style="color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin:0 0 8px; font-weight:600;">
                                                    Tu código de acceso
                                                </p>
                                                <p style="color:#667eea; font-size:36px; font-weight:800; letter-spacing:8px; margin:0; font-family:'Courier New', monospace;">
                                                    %s
                                                </p>
                                            </div>

                                            <p style="color:#6b7280; font-size:13px; line-height:1.6; margin:0 0 8px;">
                                                ⏱️ Este código expirará en <strong style="color:#374151;">5 minutos</strong>.
                                            </p>
                                            <p style="color:#ef4444; font-size:13px; line-height:1.6; margin:0;">
                                                ⚠️ Si no solicitaste este código, ignora este correo. Tu cuenta está segura.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f9fafb; padding:20px 40px; border-top:1px solid #e5e7eb; text-align:center;">
                                            <p style="color:#9ca3af; font-size:12px; margin:0;">
                                                © 2026 Medikids · Todos los derechos reservados
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(codigo);
    }
}
