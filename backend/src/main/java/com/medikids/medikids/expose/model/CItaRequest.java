package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class CItaRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String motivo;
    private String estado;
    private char asistencia;
    private String comentarios;
    private int id_horario;
    private int id_medico;
    private int id_paciente;
}
