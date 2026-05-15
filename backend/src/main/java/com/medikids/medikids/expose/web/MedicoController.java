package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;
 
@RestController
@RequestMapping("/medico")
@RequiredArgsConstructor
public class MedicoController {

    @Autowired
    private final MedicoService medicoService;

    @GetMapping("")
    public List<MedicoDto> all() {
        return medicoService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoDto> getById(@PathVariable int id) {
        MedicoDto medicoDto = medicoService.getById(id);
        if (Objects.nonNull(medicoDto)) {
            return ResponseEntity.ok(medicoDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/guardar")
    public MedicoDto save(@RequestBody MedicoRequest medico) {
        return medicoService.save(medico);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<MedicoDto> update(@PathVariable int id, @RequestBody MedicoRequest medico) {
        MedicoDto medicoDto = medicoService.update(id, medico);
        if (Objects.nonNull(medicoDto)) {
            return ResponseEntity.ok(medicoDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/especialidad/{especialidad}")
    public List<MedicoDto> getByEspecialidad(@PathVariable String especialidad) {
        return medicoService.getByEspecialidad(especialidad);
    }
}