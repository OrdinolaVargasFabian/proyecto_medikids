package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "horario_atencion")
public class HorarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dia;

    private String horaInicio;

    private String horaFin;

    private String estado;
}