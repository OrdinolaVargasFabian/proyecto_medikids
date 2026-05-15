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
@Table(name = "medico")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int id_medico;

    @Column(name = "nro_colegiatura", nullable = false, unique = true, length = 20)
    private String nro_colegiatura;

    @Column(name = "url_foto", length = 255)
    private String url_foto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoMedico estado;

    @Column(name = "id_usuario", nullable = false, unique = true)
    private int id_usuario;

    @Column(name = "id_especialidad", nullable = false)
    private int id_especialidad;

    public enum EstadoMedico {
        activo,
        inactivo
    }
}