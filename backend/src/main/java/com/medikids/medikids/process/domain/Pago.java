package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int id_pago;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "metodo_pago", nullable = false)
    private String metodo_pago;

    @Column(name = "estado_transaccion", nullable = false)
    private String estado_transaccion;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fecha_pago;

    @PrePersist
    protected void onCreate() {
        if (this.fecha_pago == null) {
            this.fecha_pago = LocalDateTime.now();
        }
    }
}
