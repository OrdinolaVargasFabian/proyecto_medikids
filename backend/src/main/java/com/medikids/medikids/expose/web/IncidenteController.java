package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.IncidenteRequest;
import com.medikids.medikids.expose.model.request.IncidenteRespuestaRequest;
import com.medikids.medikids.process.dto.IncidenteDto;
import com.medikids.medikids.process.service.IncidenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("@permiso.has('incidente:read')")
    public List<IncidenteDto> all() {
        return incidenteService.getAll();
    }

    @GetMapping("/getBy/{id}")
    @PreAuthorize("@permiso.has('incidente:read')")
    public ResponseEntity<IncidenteDto> getById(@PathVariable int id) {
        IncidenteDto incidenteDto = incidenteService.getById(id);
        if (Objects.nonNull(incidenteDto)) {
            return ResponseEntity.ok(incidenteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    @PreAuthorize("@permiso.has('incidente:write')")
    public IncidenteDto save(@RequestBody IncidenteRequest incidente) {
        return incidenteService.save(incidente);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("@permiso.has('incidente:write')")
    public ResponseEntity<IncidenteDto> update(@PathVariable int id, @RequestBody IncidenteRequest incidente) {
        IncidenteDto incidenteDto = incidenteService.update(id, incidente);
        if (Objects.nonNull(incidenteDto)) {
            return ResponseEntity.ok(incidenteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PatchMapping("/responder/{id}")
    @PreAuthorize("@permiso.has('incidente:respond')")
    public ResponseEntity<IncidenteDto> responder(@PathVariable int id, @RequestBody IncidenteRespuestaRequest request) {
        IncidenteDto incidenteDto = incidenteService.responder(id, request);
        if (Objects.nonNull(incidenteDto)) {
            return ResponseEntity.ok(incidenteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}