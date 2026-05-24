package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.CitaRequest;
import com.medikids.medikids.process.dto.CitaDto;
import com.medikids.medikids.process.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/cita")
@RequiredArgsConstructor
public class CitaController {
    @Autowired
    private final CitaService citaService;

    @GetMapping("/all")
    public List<CitaDto> all() {
        return citaService.getAll();
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<CitaDto> getById(@PathVariable int id) {
        CitaDto citaDto = citaService.getById(id);
        if (Objects.nonNull(citaDto)) {
            return ResponseEntity.ok(citaDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public CitaDto save(@RequestBody CitaRequest cita) {
        return citaService.save(cita);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CitaDto> update(@PathVariable int id, @RequestBody CitaRequest cita) {
        CitaDto citaDto = citaService.update(id, cita);
        if (Objects.nonNull(citaDto)) {
            return ResponseEntity.ok(citaDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Obtiene todas las citas de un paciente (hijo del cliente)
    @GetMapping("/paciente/{id_paciente}")
    public List<CitaDto> getByPaciente(@PathVariable int id_paciente) {
        return citaService.getByPaciente(id_paciente);
    }

    // Obtiene todas las citas de todos los hijos de un cliente (una sola consulta)
    @GetMapping("/cliente/{idCliente}")
    public List<CitaDto> getByCliente(@PathVariable int idCliente) {
        return citaService.getByCliente(idCliente);
    }

    // Marca únicamente la asistencia de una cita (0: No, 1: Sí)
    @PatchMapping("/{id}/asistencia")
    public ResponseEntity<CitaDto> marcarAsistencia(@PathVariable int id, @RequestParam char asistencia) {
        CitaDto citaDto = citaService.marcarAsistencia(id, asistencia);
        if (Objects.nonNull(citaDto)) {
            return ResponseEntity.ok(citaDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
