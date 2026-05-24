package com.medikids.medikids.process.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Table(name = "IP_autorizada")
public class IpAutorizada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int id_ip_autorizada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @ToString.Exclude
    private Usuario usuario;

    @Column(name = "ip", nullable = false, length = 45)
    private String ip;

    @Column(name = "descripcion", nullable = true, length = 150)
    private String descripcion;

    @Column(name = "activo", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    @Builder.Default
    private boolean activo = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_registro", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private Date fecha_registro;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_modificado", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private Date fecha_modificado;

    @PrePersist
    protected void onCreate() {
        Date ahora = new Date();
        this.fecha_registro = ahora;
        this.fecha_modificado = ahora;
        this.activo = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.fecha_modificado = new Date();
    }
}