package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.ClienteRequest;
import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/cliente")
@RequiredArgsConstructor
public class ClienteController {
    @Autowired
    private final ClienteService clienteService;

    @GetMapping("")
    public List<ClienteDto> all() {
        return clienteService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDto> getById(@PathVariable int id) {
        ClienteDto clienteDto = clienteService.getById(id);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<ClienteDto> getByIdUsuario(@PathVariable int idUsuario) {
        ClienteDto clienteDto = clienteService.getByIdUsuario(idUsuario);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    @PostMapping("/guardar")
    public ClienteDto save(@RequestBody ClienteRequest cliente) {
        return clienteService.save(cliente);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ClienteDto> update(@PathVariable int id, @RequestBody ClienteRequest cliente) {
        ClienteDto clienteDto = clienteService.update(id, cliente);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // filtros por nombre o apllido
    @GetMapping("/nombre/{nombre}")
    public List<ClienteDto> getByNombre(@PathVariable String nombre) {
        return clienteService.getByNombre(nombre);
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ClienteDto> getByDni(@PathVariable String dni) {
        ClienteDto clienteDto = clienteService.getByDni(dni);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
