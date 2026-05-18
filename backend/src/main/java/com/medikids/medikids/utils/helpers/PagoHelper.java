package com.medikids.medikids.utils.helpers;

import com.medikids.medikids.expose.model.request.PagoRequest;
import com.medikids.medikids.process.domain.Pago;
import com.medikids.medikids.process.dto.PagoDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class PagoHelper implements Serializable {

    private PagoHelper() {
        throw new IllegalStateException("PagoHelper class");
    }

    public static PagoDto mapPago(Pago pago) {
        return PagoDto.builder()
                .id_pago(pago.getId_pago())
                .monto(pago.getMonto())
                .metodo_pago(pago.getMetodo_pago())
                .estado_transaccion(pago.getEstado_transaccion())
                .fecha_pago(pago.getFecha_pago())
                .id_cita(pago.getId_cita())
                .build();
    }

    public static Pago buildPago(PagoRequest pago) {
        return Pago.builder()
                .monto(pago.getMonto())
                .metodo_pago(pago.getMetodo_pago())
                .estado_transaccion(pago.getEstado_transaccion())
                .fecha_pago(pago.getFecha_pago())
                .id_cita(pago.getId_cita())
                .build();
    }

    public static List<PagoDto> mapAll(List<Pago> pagos) {
        return pagos.stream()
                .map(PagoHelper::mapPago)
                .collect(Collectors.toList());
    }

    public static Page<PagoDto> mapPage(Page<Pago> pagoPage) {
        List<PagoDto> pagos = pagoPage.getContent().stream()
                .map(PagoHelper::mapPago)
                .collect(Collectors.toList());
        return new PageImpl<>(pagos);
    }
}