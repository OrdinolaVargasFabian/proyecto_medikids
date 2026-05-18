package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Table(name = "horario_atencion")
public class HorarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int id_horario;

    @Column(nullable = false)
    private String dia;

    @Column(name = "hora_inicio", nullable = false)
    private String hora_inicio;

    @Column(name = "hora_fin", nullable = false)
    private String hora_fin;

    @Column(nullable = false)
    private String estado;
}