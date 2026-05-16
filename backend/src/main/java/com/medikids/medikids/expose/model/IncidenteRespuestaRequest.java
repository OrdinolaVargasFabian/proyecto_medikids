package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
public class IncidenteRespuestaRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String respuesta_admin;
}