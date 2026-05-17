package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Setter
@Getter
public class HistorialClinicoRequest implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String diagnostico;
	private String tratamiento;
	private String observaciones;
	private LocalDate fechaRegistro;
	private Integer idCita;
	private Integer idPaciente;

}