package com.medikids.medikids.process.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Setter
@Getter
@Builder
public class HistorialClinicoDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_historial_clinico;
    private String diagnostico;
    private String tratamiento;
    private String observaciones;
    private LocalDate fecha_registro;
    private Integer id_cita;
    private Integer id_paciente;
}