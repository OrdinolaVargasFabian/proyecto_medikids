package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.PacienteRequest;
import com.medikids.medikids.process.dto.PacienteDto;
import com.medikids.medikids.process.service.PacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/paciente")
@RequiredArgsConstructor
public class PacienteController {

    @Autowired
    private final PacienteService pacienteService;

    @GetMapping("/all")
    public List<PacienteDto> all() {
        return pacienteService.getAll();
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<PacienteDto> getById(@PathVariable int id) {
        PacienteDto pacienteDto = pacienteService.getById(id);
        if (Objects.nonNull(pacienteDto)) {
            return ResponseEntity.ok(pacienteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public PacienteDto save(@RequestBody PacienteRequest paciente) {
        return pacienteService.save(paciente);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PacienteDto> update(@PathVariable int id, @RequestBody PacienteRequest paciente) {
        PacienteDto pacienteDto = pacienteService.update(id, paciente);
        if (Objects.nonNull(pacienteDto)) {
            return ResponseEntity.ok(pacienteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}