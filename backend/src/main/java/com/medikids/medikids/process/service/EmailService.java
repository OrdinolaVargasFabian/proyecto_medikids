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
                <body style="margin:0; padding:0; background-color:#f7f9f2; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f7f9f2; padding:40px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="480" cellspacing="0" cellpadding="0"
                                       style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(74,85,41,0.10); overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #9cb151 0%%, #5e6d31 100%%); padding:36px 40px; text-align:center;">
                                            <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:1px;">
                                                Medikids
                                            </h1>
                                            <p style="color:rgba(255,255,255,0.90); margin:10px 0 0; font-size:14px; letter-spacing:0.5px;">
                                                Verificación de Seguridad
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Decorative Accent Line -->
                                    <tr>
                                        <td style="height:4px; background: linear-gradient(90deg, #b8ca76 0%%, #9cb151 50%%, #7c8f3e 100%%);"></td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:40px;">
                                            <p style="color:#4a5529; font-size:16px; margin:0 0 8px; font-weight:600;">
                                                ¡Hola! 👋
                                            </p>
                                            <p style="color:#5e6d31; font-size:14px; line-height:1.7; margin:0 0 28px;">
                                                Hemos recibido una solicitud de inicio de sesión en tu cuenta.
                                                Utiliza el siguiente código para completar la verificación:
                                            </p>

                                            <!-- Código -->
                                            <div style="background: linear-gradient(135deg, #f7f9f2 0%%, #ecefdf 100%%); border:2px dashed #b8ca76; border-radius:12px; padding:28px; text-align:center; margin:0 0 28px;">
                                                <p style="color:#7c8f3e; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin:0 0 10px; font-weight:600;">
                                                    Tu código de acceso
                                                </p>
                                                <p style="color:#4a5529; font-size:38px; font-weight:800; letter-spacing:10px; margin:0; font-family:'Courier New', monospace;">
                                                    %s
                                                </p>
                                            </div>

                                            <p style="color:#5e6d31; font-size:13px; line-height:1.6; margin:0 0 10px;">
                                                ⏱️ Este código expirará en <strong style="color:#4a5529;">5 minutos</strong>.
                                            </p>
                                            <p style="color:#c0392b; font-size:13px; line-height:1.6; margin:0;">
                                                ⚠️ Si no solicitaste este código, ignora este correo. Tu cuenta está segura.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#ecefdf; padding:20px 40px; border-top:1px solid #dae1c0; text-align:center;">
                                            <p style="color:#7c8f3e; font-size:12px; margin:0;">
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
