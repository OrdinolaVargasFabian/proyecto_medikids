package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class EspecialidadRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_especialidad;
    private String nombre_especialidad;
    private String descripcion;
    private Double precio;
}