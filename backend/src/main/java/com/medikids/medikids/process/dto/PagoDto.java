package com.medikids.medikids.process.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder
public class PagoDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer idPago;
    private Double monto;
    private String metodoPago;
    private String estadoTransaccion;
    private LocalDateTime fechaPago;
    private Integer idCita;
}