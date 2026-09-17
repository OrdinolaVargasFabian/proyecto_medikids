-- Unicidad de claves naturales y cardinalidades uno-a-uno.
ALTER TABLE rol
    ADD CONSTRAINT uk_rol_nombre UNIQUE (nombre_rol);

ALTER TABLE especialidad
    ADD CONSTRAINT uk_especialidad_nombre UNIQUE (nombre);

ALTER TABLE cliente
    ADD CONSTRAINT uk_cliente_usuario UNIQUE (id_usuario),
    ADD CONSTRAINT uk_cliente_dni UNIQUE (dni_responsable);

ALTER TABLE medico
    ADD CONSTRAINT uk_medico_usuario UNIQUE (id_usuario);

ALTER TABLE rol_permiso
    ADD CONSTRAINT uk_rol_permiso UNIQUE (id_rol, id_permiso);

ALTER TABLE horario
    ADD CONSTRAINT uk_horario_bloque
        UNIQUE (id_medico, fecha, hora_inicio, hora_fin);

ALTER TABLE cita
    ADD CONSTRAINT uk_cita_horario UNIQUE (id_horario),
    ADD CONSTRAINT uk_cita_pago UNIQUE (id_pago);

ALTER TABLE historial_clinico
    ADD CONSTRAINT uk_historial_cita UNIQUE (id_cita);

-- Índices alineados con las consultas de repositorios y paneles.
CREATE INDEX idx_usuario_rol ON usuario (id_rol);
CREATE INDEX idx_medico_especialidad_activo ON medico (id_especialidad, activo);
CREATE INDEX idx_paciente_cliente ON paciente (id_cliente);
CREATE INDEX idx_horario_medico_disponible_fecha
    ON horario (id_medico, disponible, fecha, hora_inicio);
CREATE INDEX idx_cita_paciente_fecha ON cita (id_paciente, fecha_cita);
CREATE INDEX idx_cita_medico_fecha ON cita (id_medico, fecha_cita);
CREATE INDEX idx_historial_paciente_fecha
    ON historial_clinico (id_paciente, fecha_registro);
CREATE INDEX idx_incidente_medico_fecha
    ON incidente (id_medico, fecha_registro);
CREATE INDEX idx_ip_activo ON ip_autorizada (ip, activo);
CREATE INDEX idx_tarjeta_usuario_activo
    ON tarjeta_guardada (id_usuario, activo);
CREATE INDEX idx_intento_tipo_fecha
    ON intento_login (tipo, fecha_intento);

-- Integridad referencial del dominio.
ALTER TABLE usuario
    ADD CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE cliente
    ADD CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE medico
    ADD CONSTRAINT fk_medico_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    ADD CONSTRAINT fk_medico_especialidad
        FOREIGN KEY (id_especialidad) REFERENCES especialidad (id_especialidad)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE paciente
    ADD CONSTRAINT fk_paciente_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE horario
    ADD CONSTRAINT fk_horario_medico
        FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE cita
    ADD CONSTRAINT fk_cita_horario
        FOREIGN KEY (id_horario) REFERENCES horario (id_horario)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    ADD CONSTRAINT fk_cita_medico
        FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    ADD CONSTRAINT fk_cita_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    ADD CONSTRAINT fk_cita_pago
        FOREIGN KEY (id_pago) REFERENCES pago (id_pago)
        ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE historial_clinico
    ADD CONSTRAINT fk_historial_cita
        FOREIGN KEY (id_cita) REFERENCES cita (id_cita)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    ADD CONSTRAINT fk_historial_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE incidente
    ADD CONSTRAINT fk_incidente_medico
        FOREIGN KEY (id_medico) REFERENCES medico (id_medico)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ip_autorizada
    ADD CONSTRAINT fk_ip_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE refresh_token
    ADD CONSTRAINT fk_refresh_token_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE rol_permiso
    ADD CONSTRAINT fk_rol_permiso_rol
        FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    ADD CONSTRAINT fk_rol_permiso_permiso
        FOREIGN KEY (id_permiso) REFERENCES permiso (id_permiso)
        ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE tarjeta_guardada
    ADD CONSTRAINT fk_tarjeta_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE biometria
    ADD CONSTRAINT fk_biometria_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE password_reset_token
    ADD CONSTRAINT fk_password_reset_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON UPDATE RESTRICT ON DELETE CASCADE;

-- Reglas de dominio simples que MySQL puede proteger sin lógica de aplicación.
ALTER TABLE usuario
    ADD CONSTRAINT chk_usuario_visible CHECK (visible IN ('0', '1'));

ALTER TABLE medico
    ADD CONSTRAINT chk_medico_activo CHECK (activo IN ('0', '1'));

ALTER TABLE horario
    ADD CONSTRAINT chk_horario_disponible CHECK (disponible IN ('0', '1')),
    ADD CONSTRAINT chk_horario_rango CHECK (hora_fin > hora_inicio);

ALTER TABLE cita
    ADD CONSTRAINT chk_cita_asistencia
        CHECK (asistencia IS NULL OR asistencia IN ('0', '1'));

ALTER TABLE especialidad
    ADD CONSTRAINT chk_especialidad_precio
        CHECK (precio IS NULL OR precio >= 0);

ALTER TABLE pago
    ADD CONSTRAINT chk_pago_monto CHECK (monto >= 0);

ALTER TABLE tarjeta_guardada
    ADD CONSTRAINT chk_tarjeta_mes
        CHECK (mes_vencimiento BETWEEN 1 AND 12),
    ADD CONSTRAINT chk_tarjeta_ultimos_digitos
        CHECK (ultimos_digitos REGEXP '^[0-9]{4}$');

ALTER TABLE ip_autorizada
    ADD CONSTRAINT chk_ip_visible CHECK (visible IN ('0', '1'));
