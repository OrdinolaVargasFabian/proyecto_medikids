package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.process.domain.Medico;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.domain.Medico.EstadoMedico;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<MedicoDto> getAll() {
        List<Medico> medicos = medicoRepository.findAll();
        return medicos.stream().map(m -> {
            MedicoDto dto = MedicoHelper.mapMedico(m);
            Usuario u = usuarioRepository.findById((long) m.getId_usuario()).orElse(null);
            if (u != null) {
                dto.setNombres(u.getNombres());
                dto.setApellidos(u.getApellidos());
                dto.setEmail(u.getEmail());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public MedicoDto getById(int id) {
        Optional<Medico> medico = medicoRepository.findById((long) id);
        if (medico.isEmpty()) return null;
        MedicoDto dto = MedicoHelper.mapMedico(medico.get());
        Usuario u = usuarioRepository.findById((long) medico.get().getId_usuario()).orElse(null);
        if (u != null) {
            dto.setNombres(u.getNombres());
            dto.setApellidos(u.getApellidos());
            dto.setEmail(u.getEmail());
        }
        return dto;
    }

    public MedicoDto save(MedicoRequest medico) {
        return MedicoHelper.mapMedico(
                medicoRepository.save(MedicoHelper.buildMedico(medico))
        );
    }

    public MedicoDto update(int id, MedicoRequest medico) {
        Optional<Medico> medicoUpdate = medicoRepository.findById((long) id);
        if (medicoUpdate.isPresent()) {
            medicoUpdate.get().setNro_colegiatura(medico.getNro_colegiatura());
            medicoUpdate.get().setUrl_foto(medico.getUrl_foto());
            medicoUpdate.get().setEstado(EstadoMedico.valueOf(medico.getEstado()));
            medicoUpdate.get().setId_especialidad(medico.getId_especialidad());

            return MedicoHelper.mapMedico(
                    medicoRepository.save(medicoUpdate.get())
            );
        }
        return null;
    }

    public MedicoDto toggleStatus(int id) {
        Optional<Medico> medicoOpt = medicoRepository.findById((long) id);
        if (medicoOpt.isEmpty()) return null;

        Medico medico = medicoOpt.get();
        medico.setEstado(
                medico.getEstado() == Medico.EstadoMedico.activo
                        ? Medico.EstadoMedico.inactivo
                        : Medico.EstadoMedico.activo
        );
        MedicoDto dto = MedicoHelper.mapMedico(medicoRepository.save(medico));
        Usuario u = usuarioRepository.findById((long) medico.getId_usuario()).orElse(null);
        if (u != null) {
            dto.setNombres(u.getNombres());
            dto.setApellidos(u.getApellidos());
            dto.setEmail(u.getEmail());
        }
        return dto;
    }
    public List<MedicoDto> getByEspecialidad(String especialidad) {
        return MedicoHelper.mapAll(
                medicoRepository.findAll().stream()
                        .filter(medico -> medico.getId_especialidad() == Integer.parseInt(especialidad))
                        .toList()
        );
    }

    public List<MedicoDto> getByNombre(String nombre) {
        return MedicoHelper.mapAll(
            medicoRepository.findAll().stream()
                .filter(medico -> medico.getUsuario().getNombres().toLowerCase().contains(nombre.toLowerCase())
                || medico.getUsuario().getApellidos().toLowerCase().contains(nombre.toLowerCase()))
                .toList()
        );
    }

}