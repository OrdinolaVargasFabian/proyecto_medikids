package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter

public class ClienteRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_cliente;
    private int id_usuario;
    private int dni_responsable;
    private String direccion;
}
