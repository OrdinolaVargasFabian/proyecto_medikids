package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.SemanaRequest;
import com.medikids.medikids.process.dto.HorarioDto;
import com.medikids.medikids.process.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin("*")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping("/medico/{idMedico}")
    @PreAuthorize("@permiso.has('horario:read')")
    public List<HorarioDto> getByMedico(@PathVariable int idMedico) {
        return horarioService.getByMedico(idMedico);
    }

    @GetMapping("/medico/{idMedico}/disponibles")
    @PreAuthorize("@permiso.has('horario:read')")
    public List<HorarioDto> getDisponiblesByMedico(@PathVariable int idMedico) {
        return horarioService.getDisponiblesByMedico(idMedico);
    }

    @GetMapping("/medico/{idMedico}/semana")
    @PreAuthorize("@permiso.has('horario:read')")
    public List<HorarioDto> getSemana(
            @PathVariable int idMedico,
            @RequestParam("inicio") LocalDate inicio,
            @RequestParam("fin") LocalDate fin) {
        return horarioService.getHorariosBySemana(idMedico, inicio, fin);
    }

    @PostMapping("/save-semana")
    @PreAuthorize("@permiso.has('horario:write')")
    @ResponseStatus(HttpStatus.OK)
    public void saveSemana(@RequestBody SemanaRequest request) {
        horarioService.saveSemana(request);
    }
}
