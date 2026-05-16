package com.medikids.medikids.expose.web;

import com.medikids.medikids.process.domain.HorarioAtencion;
import com.medikids.medikids.process.service.HorarioAtencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin("*")
public class HorarioAtencionController {

    @Autowired
    private HorarioAtencionService service;

    @GetMapping
    public List<HorarioAtencion> listar() {
        return service.listar();
    }

    @PostMapping
    public HorarioAtencion guardar(@RequestBody HorarioAtencion horario) {
        return service.guardar(horario);
    }
}