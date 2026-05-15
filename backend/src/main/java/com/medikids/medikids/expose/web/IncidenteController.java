package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.IncidenteRequest;
import com.medikids.medikids.process.dto.IncidenteDto;
import com.medikids.medikids.process.service.IncidenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/incidente")
@RequiredArgsConstructor
public class IncidenteController {

    @Autowired
    private final IncidenteService incidenteService;

    @GetMapping("/all")
    public List<IncidenteDto> all() {
        return incidenteService.getAll();
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<IncidenteDto> getById(@PathVariable int id) {
        IncidenteDto incidenteDto = incidenteService.getById(id);
        if (Objects.nonNull(incidenteDto)) {
            return ResponseEntity.ok(incidenteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public IncidenteDto save(@RequestBody IncidenteRequest incidente) {
        return incidenteService.save(incidente);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<IncidenteDto> update(@PathVariable int id, @RequestBody IncidenteRequest incidente) {
        IncidenteDto incidenteDto = incidenteService.update(id, incidente);
        if (Objects.nonNull(incidenteDto)) {
            return ResponseEntity.ok(incidenteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}