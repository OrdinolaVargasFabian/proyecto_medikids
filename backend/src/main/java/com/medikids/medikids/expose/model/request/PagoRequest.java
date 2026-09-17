package com.medikids.medikids.expose.model.request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Setter
@Getter
public class PagoRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private BigDecimal monto;
    private String metodo_pago;
}
