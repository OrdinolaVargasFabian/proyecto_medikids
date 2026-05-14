package com.medikids.medikids.process.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@Builder
public class CitaDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_cita;
    private String motivo;
    private Date fecha_registro;
    private String estado;
    private char asistencia;
    private String comentarios;
    private int id_horario;
    private int id_medico;
    private int id_paciente;
}
