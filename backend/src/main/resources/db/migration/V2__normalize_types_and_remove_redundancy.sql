-- Retira constraints generados por Hibernate para recrearlos con nombres estables.
ALTER TABLE biometria DROP FOREIGN KEY FKs0mej9c258bxc7sfne6n8m528;
ALTER TABLE cliente DROP FOREIGN KEY FKetx0tojxf5yevxcyt6qb526x5;
ALTER TABLE password_reset_token DROP FOREIGN KEY FKno4ngi2ecktio49ytrq5d2cxh;

ALTER TABLE biometria DROP INDEX FKs0mej9c258bxc7sfne6n8m528;
ALTER TABLE cliente DROP INDEX FKetx0tojxf5yevxcyt6qb526x5;

-- Documentos y teléfonos son identificadores, no cantidades.
ALTER TABLE usuario
    MODIFY telefono VARCHAR(20) NOT NULL;

ALTER TABLE cliente
    MODIFY dni_responsable VARCHAR(20) NOT NULL;

-- Todas las referencias a usuario deben coincidir con INT UNSIGNED.
ALTER TABLE medico
    MODIFY id_usuario INT UNSIGNED NOT NULL;

ALTER TABLE ip_autorizada
    MODIFY id_usuario INT UNSIGNED NOT NULL;

ALTER TABLE refresh_token
    MODIFY id_usuario INT UNSIGNED NOT NULL;

ALTER TABLE tarjeta_guardada
    MODIFY id_usuario INT UNSIGNED NOT NULL;

-- Los importes monetarios usan aritmética decimal exacta.
ALTER TABLE especialidad
    MODIFY precio DECIMAL(10,2) NULL;

ALTER TABLE pago
    MODIFY monto DECIMAL(10,2) NOT NULL;

-- Unifica la referencia duplicada a médico en horario.
UPDATE horario
SET id_medico = medico_id
WHERE id_medico <> medico_id;

ALTER TABLE horario
    DROP COLUMN medico_id;

-- La aplicación relaciona pago desde cita.id_pago; se migra y elimina el lado redundante.
UPDATE cita c
JOIN pago p ON p.id_cita = c.id_cita
SET c.id_pago = p.id_pago
WHERE c.id_pago IS NULL;

ALTER TABLE pago
    DROP COLUMN id_cita;

ALTER TABLE historial_clinico
    MODIFY id_historial_clinico INT NOT NULL AUTO_INCREMENT;

-- Nombres de índices estables y legibles.
ALTER TABLE admin_config
    RENAME INDEX UK3chkqgmqfl4nuij6m7g4p33bw TO uk_admin_config_clave;

ALTER TABLE usuario
    RENAME INDEX UK5171l57faosmj8myawaucatdw TO uk_usuario_email;

ALTER TABLE medico
    RENAME INDEX UK7pxgh97yobji0ge2787qvpq1u TO uk_medico_colegiatura;

ALTER TABLE paciente
    RENAME INDEX UK22b31nu919ls18cjou343takx TO uk_paciente_dni;

ALTER TABLE permiso
    RENAME INDEX UK8c7k3y09q0jf18cav2ahenq31 TO uk_permiso_codigo;

ALTER TABLE refresh_token
    RENAME INDEX UKr4k4edos30bx9neoq81mdvwph TO uk_refresh_token;

ALTER TABLE password_reset_token
    RENAME INDEX UKg0guo4k8krgpwuagos61oc06j TO uk_password_reset_token,
    RENAME INDEX UKjohu5tq9i7cy1fgyemmlme0p2 TO uk_password_reset_usuario;
