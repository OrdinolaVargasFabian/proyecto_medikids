package com.medikids.medikids.expose.web;

import com.medikids.medikids.expose.model.MedicoConUsuarioRequest;
import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.expose.model.UsuarioRequest;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.dto.UsuarioDto;
import com.medikids.medikids.process.service.MedicoService;
import com.medikids.medikids.process.service.UsuarioService;
import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/medico")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/all")
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

    @GetMapping("/getBy/{id}")
    public ResponseEntity<MedicoDto> getById(@PathVariable int id) {
        MedicoDto dto = medicoService.getById(id);
        if (Objects.nonNull(dto)) return ResponseEntity.ok(dto);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/save")
    public MedicoDto save(@RequestBody MedicoRequest request) {
        return medicoService.save(request);
    }

    @PostMapping("/saveWithUser")
    public ResponseEntity<Map<String, Object>> saveWithUser(@RequestBody MedicoConUsuarioRequest request) {
        try {
            UsuarioRequest userReq = new UsuarioRequest();
            userReq.setId_rol(2);
            userReq.setNombres(request.getNombres());
            userReq.setApellidos(request.getApellidos());
            userReq.setEmail(request.getEmail());
            userReq.setPassword(request.getPassword());
            userReq.setTelefono(request.getTelefono());

            UsuarioDto usuario = usuarioService.save(userReq);

            MedicoRequest medicoReq = new MedicoRequest();
            medicoReq.setNro_colegiatura(request.getNro_colegiatura());
            medicoReq.setUrl_foto(request.getUrl_foto() != null ? request.getUrl_foto() : "");
            medicoReq.setEstado(request.getEstado() != null ? request.getEstado() : "activo");
            medicoReq.setId_usuario(usuario.getId_usuario());
            medicoReq.setId_especialidad(request.getId_especialidad());

            MedicoDto medico = medicoService.save(medicoReq);

            Map<String, Object> result = new HashMap<>();
            result.put("medico", medico);
            result.put("usuario", usuario);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("ya está registrado")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", msg));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al registrar médico: " + msg));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MedicoDto> update(@PathVariable int id, @RequestBody MedicoRequest request) {
        MedicoDto dto = medicoService.update(id, request);
        if (Objects.nonNull(dto)) return ResponseEntity.ok(dto);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<MedicoDto> toggleStatus(@PathVariable int id) {
        MedicoDto dto = medicoService.toggleStatus(id);
        if (Objects.nonNull(dto)) return ResponseEntity.ok(dto);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
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
