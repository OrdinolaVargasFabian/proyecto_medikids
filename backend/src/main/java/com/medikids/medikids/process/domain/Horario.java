package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Table(name = "horario")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int id_horario;

    @Column(nullable = false)
    private Date fecha;

    @Column(name = "hora_inicio", nullable = false)
    private Time hora_inicio;

    @Column(name = "hora_fin", nullable = false)
    private Time hora_fin;

    @Column(name = "disponible", nullable = false)
    private char disponible;

    @Column(name = "id_medico", nullable = false)
    private int id_medico;
}
