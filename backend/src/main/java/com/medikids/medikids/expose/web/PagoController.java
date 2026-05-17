package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.PagoRequest;
import com.medikids.medikids.process.dto.PagoDto;
import com.medikids.medikids.process.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@CrossOrigin("*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public List<PagoDto> listarPagos() {
        return pagoService.listarPagos();
    }

    @PostMapping
    public PagoDto guardarPago(@RequestBody PagoRequest pago) {
        return pagoService.guardarPago(pago);
    }
}