package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Setter
@Getter
public class PagoRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_pago;
    private double monto;
    private String metodo_pago;
    private String estado;
    private LocalDate fecha_pago;
    private int id_cita;
    
}
