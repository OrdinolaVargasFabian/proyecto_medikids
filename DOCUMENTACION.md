# MediKids

MediKids es una plataforma web de gestión pediátrica pensada para centralizar la relación entre familias, médicos y administración de una clínica infantil. Su objetivo es ofrecer una experiencia clara, cercana y rápida para consultar información médica, organizar citas y dar seguimiento al historial de atención de cada paciente.

La solución combina un portal público de presentación con un entorno privado para distintos tipos de usuario, de modo que cada perfil vea únicamente las herramientas que necesita en su trabajo diario.

## Propósito

Este proyecto busca simplificar la coordinación de la atención pediátrica en un solo lugar. Desde una misma plataforma es posible:

- Presentar los servicios de la clínica a nuevas familias.
- Acceder a una cuenta personal mediante autenticación.
- Gestionar hijos o pacientes asociados a una familia.
- Agendar y revisar citas.
- Consultar historiales y seguimiento clínico.
- Permitir al personal médico revisar su agenda y actualizar el estado de atención.
- Dar a administración una vista general de la actividad diaria.

## Perfiles de usuario

### Padres o tutores

Este perfil está orientado a la gestión cotidiana de la salud de sus hijos. Desde su espacio pueden acceder a un panel con indicadores generales, consultar próximos compromisos, entrar al historial y abrir el flujo de agendamiento de citas.

La navegación está pensada para ser simple, visual y rápida, con accesos directos a las acciones más frecuentes.

### Médicos

El área médica se enfoca en el control de agenda y seguimiento de pacientes. Permite revisar citas por día, ver el historial de un paciente específico y registrar el estado de asistencia de una consulta.

La prioridad aquí es la eficiencia operativa: ver lo relevante de forma ordenada y actuar con pocos pasos.

### Administradores

El perfil administrativo ofrece una visión consolidada de la actividad del día. Su función principal es supervisar el volumen de citas, el estado de atención y la distribución del trabajo entre profesionales.

Este espacio apoya la toma de decisiones y el control operativo de la clínica.

## Módulos principales

### Portal público

La página principal presenta la propuesta de valor de MediKids, sus servicios, el equipo médico, testimonios y respuestas a preguntas frecuentes. Su función es introducir la marca y facilitar el acceso al portal privado.

### Autenticación

El acceso al sistema se realiza mediante correo y contraseña, seguido de una verificación adicional por código. Este esquema aporta una capa extra de seguridad al inicio de sesión.

### Panel de padres

Incluye:

- Resumen general con indicadores.
- Accesos rápidos a las funciones más usadas.
- Gestión de hijos o pacientes asociados.
- Historial de consultas.
- Agenda de nuevas citas.
- Vista de perfil personal.

### Panel médico

Incluye:

- Resumen del estado de la jornada.
- Agenda diaria por fecha.
- Detalle del paciente, motivo de consulta y estado.
- Acciones para marcar asistencia o ausencia.
- Acceso al historial de cada paciente.

### Panel administrativo

Incluye:

- Resumen global del día.
- Tabla de citas con médico, especialidad y estado.
- Filtros visuales para seguimiento operativo.


## Arquitectura del sistema

Cómo está estructurado el sistema:

- Frontend: Aplicación de una sola página (SPA) construida con React y Vite. Se encarga de la interfaz, navegación y experiencias por rol (padres, médicos, administradores).
- Backend: API REST construida con Spring Boot (Java 17). Expone controladores que implementan la lógica de negocio y la persistencia.
- APIs: Endpoints REST que comunican frontend y backend usando JSON. La autenticación usa JWT y un paso adicional de verificación por código (2FA por email).
- Base de datos: MySQL (conector en el backend). El backend usa JPA/Hibernate para mapear entidades a tablas.
- Servicios externos: Servicio de correo electrónico (SMTP) para envío de códigos de verificación y notificaciones; librería JWT (`jjwt`) para tokens; potencial conexión a un servicio de pagos si se integra en el futuro.

## Stack tecnológico

- Lenguajes:
	- Java 17 (backend)
	- JavaScript / JSX (frontend)

- Frameworks y plataformas:
	- Backend: Spring Boot (versión definida en `pom.xml`, starter-parent 4.x)
	- Frontend: React (v19) con Vite como build tool

- Base de datos:
	- MySQL (driver `mysql-connector-j` en el backend)

- Librerías y dependencias destacadas:
	- Backend: Spring Boot Starters (web, data-jpa, security, mail, actuator), Lombok, JJWT (io.jsonwebtoken)
	- Frontend: React, React Router, Framer Motion, Tailwind CSS, Lucide/react (iconos), Vite

Nota: las versiones concretas del frontend están en `frontend/package.json` y las dependencias del backend en `backend/pom.xml`.

## APIs / Endpoints (resumen)

Se listan los endpoints principales expuestos por el backend, método HTTP, payload esperado y respuesta.

- Autenticación
	- POST /auth/login
		- Recibe: `LoginRequest` { "email": string, "password": string }
		- Devuelve: `AuthResponse` parcial o un mensaje indicando que se envió un código (si credenciales válidas). No devuelve aún el JWT hasta la verificación.
	- POST /auth/verify-2fa
		- Recibe: `VerifyCodeRequest` { "email": string, "code": string }
		- Devuelve: `AuthResponse` { "token": string, "message": string, "usuario": UsuarioDto } en caso de éxito; 401 si el código es inválido o expiró.

- Gestión de citas
	- GET /cita/all
		- Devuelve: List<CitaDto> — todas las citas.
	- GET /cita/getBy/{id}
		- Parámetros: `id` (path)
		- Devuelve: `CitaDto` o 404 si no existe.
	- POST /cita/save
		- Recibe: `CItaRequest` {
				"motivo": string,
				"estado": string,
				"asistencia": char,
				"comentarios": string,
				"id_horario": int,
				"id_medico": int,
				"id_paciente": int
			}
		- Devuelve: `CitaDto` creada.
	- PUT /cita/update/{id}
		- Recibe: `CItaRequest` (igual que arriba)
		- Devuelve: `CitaDto` actualizado o 404 si no existe.
	- GET /cita/paciente/{id_paciente}
		- Devuelve: List<CitaDto> — citas del paciente especificado.
	- PATCH /cita/{id}/asistencia
		- Recibe: `AsistenciaRequest` (campo para marcar asistencia)
		- Devuelve: `CitaDto` con asistencia actualizada o 404.

- Gestión de pacientes
	- GET /paciente/all
		- Devuelve: List<PacienteDto>
	- GET /paciente/getBy/{id}
		- Devuelve: `PacienteDto` o 404.
	- POST /paciente/save
		- Recibe: `PacienteRequest` {
				"id_paciente": int,
				"nombre_completo": string,
				"dni_menor": string,
				"fecha_nacimiento": yyyy-MM-dd,
				"id_cliente": int
			}
		- Devuelve: `PacienteDto` creado.
	- PUT /paciente/update/{id}
		- Recibe: `PacienteRequest`
		- Devuelve: `PacienteDto` actualizado o 404.

- Gestión de médicos
	- GET /medico
		- Devuelve: List<MedicoDto>
	- GET /medico/{id}
		- Devuelve: `MedicoDto` o 404.
	- POST /medico/guardar
		- Recibe: `MedicoRequest` { campos como `id_medico`, `nro_colegiatura`, `url_foto`, `estado`, `usuario`, `id_especialidad` }
		- Devuelve: `MedicoDto` creado.
	- PUT /medico/actualizar/{id}
		- Recibe: `MedicoRequest`
		- Devuelve: `MedicoDto` actualizado o 404.
	- GET /medico/especialidad/{especialidad}
		- Devuelve: List<MedicoDto> filtrados por especialidad.

- Pagos
	- GET /pagos
		- Devuelve: List<Pago>
	- POST /pagos
		- Recibe: `Pago` o `PagoRequest` { "monto": double, "metodo_pago": string, "estado": string, "fecha_pago": yyyy-MM-dd, "id_cita": int }
		- Devuelve: `Pago` guardado.


