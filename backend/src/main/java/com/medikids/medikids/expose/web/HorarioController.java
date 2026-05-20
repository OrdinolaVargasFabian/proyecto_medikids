package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.HorarioRequest;
import com.medikids.medikids.process.dto.HorarioDto;
import com.medikids.medikids.process.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin("*")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping("/all")
    public List<HorarioDto> getAll() {
        return horarioService.getAll();
    }

    @GetMapping("/{id}")
    public HorarioDto getById(@PathVariable int id) {
        return horarioService.getById(id);
    }

    /* @PostMapping
    public HorarioDto save(@RequestBody HorarioRequest horario) {
        return horarioService.save(horario);
    }
     */

    @PutMapping("/{id}")
    public HorarioDto update(@PathVariable int id, @RequestBody HorarioRequest horario) {
        return horarioService.update(id, horario);
    }

    @GetMapping("/medico/{idMedico}")
    public List<HorarioDto> getByMedico(@PathVariable int idMedico) {
        return horarioService.getByMedico(idMedico);
    }

    @PostMapping("/save")
    public List<HorarioDto> saveBloques(@RequestBody HorarioRequest horario) {
        return horarioService.saveBloquesDeUnaHora(horario);
    }
}
