package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.UsuarioRequest;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.UsuarioDto;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDto> getAll() {
        return UsuarioHelper.mapAll(usuarioRepository.findAll());
    }

    public UsuarioDto getById(int id) {
        Optional<Usuario> usuario = usuarioRepository.findById((long) id);
        return usuario.map(UsuarioHelper::mapUsuario).orElse(null);
    }

    public UsuarioDto save(UsuarioRequest usuario) {
        // Validar que el email no esté registrado
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }
        // Encriptar password antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return UsuarioHelper.mapUsuario(usuarioRepository.save(UsuarioHelper.buildUsuario(usuario)));
    }

    public UsuarioDto update(int id, UsuarioRequest usuario) {
        Optional<Usuario> usuarioUpdate = usuarioRepository.findById((long) id);
        if (usuarioUpdate.isPresent()) {
            usuarioUpdate.get().setId_rol(usuario.getId_rol());
            usuarioUpdate.get().setNombres(usuario.getNombres());
            usuarioUpdate.get().setApellidos(usuario.getApellidos());
            usuarioUpdate.get().setEmail(usuario.getEmail());
            usuarioUpdate.get().setPassword(passwordEncoder.encode(usuario.getPassword()));
            usuarioUpdate.get().setTelefono(usuario.getTelefono());
            usuarioUpdate.get().setFecha_modificado(new Date());

            return UsuarioHelper.mapUsuario(usuarioRepository.save(usuarioUpdate.get()));
        }
        return null;
    }

    public Boolean delete(int id) {
        Optional<Usuario> usuario = usuarioRepository.findById((long) id);
        if (usuario.isPresent()) {
            usuario.get().setVisible('0');
            usuario.get().setFecha_modificado(new Date());

            usuarioRepository.save(usuario.get());
            return Boolean.TRUE;
        }

        return Boolean.FALSE;
    }
}
