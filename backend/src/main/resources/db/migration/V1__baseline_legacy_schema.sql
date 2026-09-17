-- Baseline reproducible del esquema anterior a la normalización.
-- En bases existentes Flyway registra esta versión como baseline.
-- En bases nuevas crea la estructura y luego aplica las migraciones posteriores.

CREATE TABLE rol (
    id_rol INT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE permiso (
    id_permiso INT NOT NULL AUTO_INCREMENT,
    accion VARCHAR(50) NOT NULL,
    codigo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    nombre VARCHAR(150) NOT NULL,
    recurso VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_permiso),
    UNIQUE KEY UK8c7k3y09q0jf18cav2ahenq31 (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE especialidad (
    id_especialidad INT NOT NULL AUTO_INCREMENT,
    descripcion TEXT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DOUBLE NULL,
    PRIMARY KEY (id_especialidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE usuario (
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
    activo BIT(1) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    codigo_expiracion DATETIME(6) NULL,
    codigo_verificacion VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    fecha_modificado DATETIME(6) NOT NULL,
    fecha_registro DATETIME(6) NOT NULL,
    id_rol INT NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono INT NOT NULL,
    visible VARCHAR(1) NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY UK5171l57faosmj8myawaucatdw (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE admin_config (
    id_admin_config INT NOT NULL AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL,
    valor TEXT NOT NULL,
    PRIMARY KEY (id_admin_config),
    UNIQUE KEY UK3chkqgmqfl4nuij6m7g4p33bw (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cliente (
    id_cliente INT NOT NULL AUTO_INCREMENT,
    direccion VARCHAR(255) NOT NULL,
    dni_responsable INT NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_cliente),
    KEY FKetx0tojxf5yevxcyt6qb526x5 (id_usuario),
    CONSTRAINT FKetx0tojxf5yevxcyt6qb526x5
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE medico (
    id_medico INT NOT NULL AUTO_INCREMENT,
    activo VARCHAR(1) NOT NULL,
    estado ENUM('activo','inactivo') NULL,
    genero ENUM('femenino','masculino','otro') NULL,
    id_especialidad INT NOT NULL,
    id_usuario INT NOT NULL,
    nro_colegiatura VARCHAR(20) NOT NULL,
    url_foto VARCHAR(255) NULL,
    PRIMARY KEY (id_medico),
    UNIQUE KEY UK7pxgh97yobji0ge2787qvpq1u (nro_colegiatura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE paciente (
    id_paciente INT NOT NULL AUTO_INCREMENT,
    dni_menor VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_cliente INT NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_paciente),
    UNIQUE KEY UK22b31nu919ls18cjou343takx (dni_menor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE horario (
    id_horario INT NOT NULL AUTO_INCREMENT,
    disponible VARCHAR(1) NOT NULL,
    fecha DATE NOT NULL,
    hora_fin TIME NOT NULL,
    hora_inicio TIME NOT NULL,
    id_medico INT NOT NULL,
    medico_id INT NOT NULL,
    PRIMARY KEY (id_horario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pago (
    id_pago INT NOT NULL AUTO_INCREMENT,
    estado_transaccion VARCHAR(255) NOT NULL,
    fecha_pago DATETIME(6) NOT NULL,
    id_cita INT NULL,
    metodo_pago VARCHAR(255) NOT NULL,
    monto DOUBLE NOT NULL,
    PRIMARY KEY (id_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cita (
    id_cita INT NOT NULL AUTO_INCREMENT,
    asistencia VARCHAR(1) NULL,
    comentarios VARCHAR(255) NULL,
    estado VARCHAR(255) NOT NULL,
    fecha_cita DATE NULL,
    fecha_registro DATETIME(6) NOT NULL,
    hora_cita VARCHAR(10) NULL,
    id_horario INT NOT NULL,
    id_medico INT NOT NULL,
    id_paciente INT NOT NULL,
    id_pago INT NULL,
    motivo VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_cita)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE historial_clinico (
    id_historial_clinico INT NOT NULL,
    diagnostico TEXT NOT NULL,
    fecha_registro DATE NOT NULL,
    id_cita INT NOT NULL,
    id_paciente INT NOT NULL,
    observaciones TEXT NULL,
    tratamiento TEXT NOT NULL,
    PRIMARY KEY (id_historial_clinico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE incidente (
    id_incidente INT NOT NULL AUTO_INCREMENT,
    descripcion TEXT NOT NULL,
    fecha_registro DATETIME(6) NOT NULL,
    id_medico INT NOT NULL,
    respuesta_admin TEXT NULL,
    tipo_incidente VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_incidente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE intento_login (
    id_intento INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    exitoso BIT(1) NOT NULL,
    fecha_intento DATETIME(6) NOT NULL,
    ip_origen VARCHAR(45) NULL,
    tipo VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_intento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ip_autorizada (
    id_ip_autorizada INT NOT NULL AUTO_INCREMENT,
    activo BIT(1) NOT NULL,
    descripcion VARCHAR(150) NULL,
    fecha_modificado DATETIME(6) NOT NULL,
    fecha_registro DATETIME(6) NOT NULL,
    id_usuario INT NOT NULL,
    ip VARCHAR(45) NOT NULL,
    visible VARCHAR(1) NOT NULL,
    PRIMARY KEY (id_ip_autorizada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE refresh_token (
    id BIGINT NOT NULL AUTO_INCREMENT,
    expiry_date DATETIME(6) NOT NULL,
    fingerprint VARCHAR(64) NULL,
    id_usuario INT NOT NULL,
    ip_origen VARCHAR(45) NULL,
    revoked BIT(1) NOT NULL,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UKr4k4edos30bx9neoq81mdvwph (token),
    KEY idx_refresh_token_id_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE rol_permiso (
    id_rol_permiso INT NOT NULL AUTO_INCREMENT,
    id_permiso INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_rol_permiso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tarjeta_guardada (
    id_tarjeta INT NOT NULL AUTO_INCREMENT,
    activo BIT(1) NOT NULL,
    alias VARCHAR(50) NOT NULL,
    anio_vencimiento INT NOT NULL,
    es_predeterminada BIT(1) NOT NULL,
    fecha_creacion DATETIME(6) NULL,
    id_usuario INT NOT NULL,
    marca VARCHAR(20) NOT NULL,
    mes_vencimiento INT NOT NULL,
    nombre_titular VARCHAR(255) NOT NULL,
    ultimos_digitos VARCHAR(4) NOT NULL,
    PRIMARY KEY (id_tarjeta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE biometria (
    id_biometria INT UNSIGNED NOT NULL AUTO_INCREMENT,
    activo BIT(1) NOT NULL,
    face_descriptor JSON NOT NULL,
    fecha_registro DATETIME(6) NOT NULL,
    muestra INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_biometria),
    KEY FKs0mej9c258bxc7sfne6n8m528 (id_usuario),
    CONSTRAINT FKs0mej9c258bxc7sfne6n8m528
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE password_reset_token (
    id BIGINT NOT NULL AUTO_INCREMENT,
    expiry_date DATETIME(6) NOT NULL,
    token VARCHAR(255) NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UKg0guo4k8krgpwuagos61oc06j (token),
    UNIQUE KEY UKjohu5tq9i7cy1fgyemmlme0p2 (id_usuario),
    CONSTRAINT FKno4ngi2ecktio49ytrq5d2cxh
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
