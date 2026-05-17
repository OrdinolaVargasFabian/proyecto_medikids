package com.medikids.medikids.expose.model.request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class CitaRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String motivo;
    private String estado;
    private char asistencia; // 0: No | 1: Sí
    private String comentarios;
    private int id_horario;
    private int id_medico;
    private int id_paciente;
}
