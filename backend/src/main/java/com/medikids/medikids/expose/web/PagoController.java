package com.medikids.medikids.expose.web;

import com.medikids.medikids.process.domain.Pago;
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
    public List<Pago> listarPagos() {
        return pagoService.listarPagos();
    }

    @PostMapping
    public Pago guardarPago(@RequestBody Pago pago) {
        return pagoService.guardarPago(pago);
    }
}