package com.medikids.medikids_osorio_backend.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Setter
@Getter
public class PacienteRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_paciente;         
    private String nombre_completo;   
    private String dni_menor;        
    private LocalDate fecha_nacimiento;
    private int id_cliente;           
}