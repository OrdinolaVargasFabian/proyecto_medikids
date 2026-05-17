package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
public class IncidenteRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_incidente;
    private String tipo_incidente;
    private String descripcion;
    private String respuesta_admin;
    private LocalDateTime fecha_registro;
    private int id_medico;
}