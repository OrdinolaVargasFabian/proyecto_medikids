package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    private Double monto;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Column(name = "estado_transaccion")
    private String estadoTransaccion;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "id_cita")
    private Integer idCita;
}