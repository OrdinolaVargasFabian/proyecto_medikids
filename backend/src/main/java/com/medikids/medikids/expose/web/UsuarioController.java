package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.request.UsuarioRequest;
import com.medikids.medikids.expose.model.request.PasswordRequest;
import com.medikids.medikids.process.dto.UsuarioDto;
import com.medikids.medikids.process.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
public class UsuarioController {
    @Autowired
    private final UsuarioService usuarioService;

    @GetMapping("/all")
    public List<UsuarioDto> all() {
        return usuarioService.getAll();
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<UsuarioDto> getById(@PathVariable int id) {
        UsuarioDto usuarioDto = usuarioService.getById(id);
        if (Objects.nonNull(usuarioDto)) {
            return ResponseEntity.ok(usuarioDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public UsuarioDto save(@RequestBody UsuarioRequest usuario) {
        return usuarioService.save(usuario);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UsuarioDto> update(@PathVariable int id, @RequestBody UsuarioRequest usuario) {
        UsuarioDto usuarioDto = usuarioService.update(id, usuario);
        if (Objects.nonNull(usuarioDto)) {
            return ResponseEntity.ok(usuarioDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<Void> changePassword(@PathVariable int id, @RequestBody PasswordRequest request) {
        if (usuarioService.changePassword(id, request.getCurrentPassword(), request.getNewPassword())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        Boolean isDelete = usuarioService.delete(id);
        if (isDelete)
            return ResponseEntity.ok().build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
