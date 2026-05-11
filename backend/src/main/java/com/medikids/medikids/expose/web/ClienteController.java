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

    @GetMapping("/all")
    public List<ClienteDto> all() {
        return clienteService.getAll();
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<ClienteDto> getById(@PathVariable int id) {
        ClienteDto clienteDto = clienteService.getById(id);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public ClienteDto save(@RequestBody ClienteRequest cliente) {
        return clienteService.save(cliente);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ClienteDto> update(@PathVariable int id, @RequestBody ClienteRequest cliente) {
        ClienteDto clienteDto = clienteService.update(id, cliente);
        if (Objects.nonNull(clienteDto)) {
            return ResponseEntity.ok(clienteDto);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
