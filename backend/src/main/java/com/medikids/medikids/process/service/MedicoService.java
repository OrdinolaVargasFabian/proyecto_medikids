package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.MedicoRequest;
import com.medikids.medikids.process.domain.Medico;
import com.medikids.medikids.process.domain.Medico.EstadoMedico;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.repository.EspecialidadRepository;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.EspecialidadHelper;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
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

    @Autowired
    private EspecialidadRepository especialidadRepository;

    // Enriquece un MedicoDto con los datos de su Usuario y Especialidad
    private MedicoDto enriquecer(MedicoDto dto) {
        usuarioRepository.findById(dto.getId_usuario()).ifPresent(usuario ->
                dto.setUsuario(UsuarioHelper.mapUsuario(usuario))
        );
        especialidadRepository.findById(dto.getId_especialidad()).ifPresent(especialidad ->
                dto.setEspecialidad(EspecialidadHelper.mapEspecialidad(especialidad))
        );
        return dto;
    }

    public List<MedicoDto> getAll() {
        return MedicoHelper.mapAll(medicoRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public MedicoDto getById(int id) {
        Optional<Medico> medico = medicoRepository.findById(id);
        return medico.map(m -> enriquecer(MedicoHelper.mapMedico(m))).orElse(null);
    }

    public MedicoDto save(MedicoRequest medico) {
        return enriquecer(MedicoHelper.mapMedico(
                medicoRepository.save(MedicoHelper.buildMedico(medico))
        ));
    }

    public MedicoDto update(int id, MedicoRequest medico) {
        Optional<Medico> medicoUpdate = medicoRepository.findById(id);
        if (medicoUpdate.isPresent()) {
            medicoUpdate.get().setNro_colegiatura(medico.getNro_colegiatura());
            medicoUpdate.get().setUrl_foto(medico.getUrl_foto());
            medicoUpdate.get().setEstado(EstadoMedico.valueOf(medico.getEstado()));
            medicoUpdate.get().setId_especialidad(medico.getId_especialidad());

            return enriquecer(MedicoHelper.mapMedico(
                    medicoRepository.save(medicoUpdate.get())
            ));
        }
        return null;
    }

    public MedicoDto toggleStatus(int id) {
        Optional<Medico> medicoOpt = medicoRepository.findById(id);
        if (medicoOpt.isEmpty()) return null;

        Medico medico = medicoOpt.get();
        if (medico.getActivo() == '1') {
            medico.setActivo('0');
            medico.setEstado(EstadoMedico.inactivo);
        } else {
            medico.setActivo('1');
            medico.setEstado(EstadoMedico.activo);
        }
        return enriquecer(MedicoHelper.mapMedico(medicoRepository.save(medico)));
    }

    public boolean delete(int id) {
        if (medicoRepository.existsById(id)) {
            medicoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<MedicoDto> getByEspecialidad(String especialidad) {
        return MedicoHelper.mapAll(
                medicoRepository.findAll().stream()
                        .filter(medico -> medico.getId_especialidad() == Integer.parseInt(especialidad))
                        .toList()
        ).stream().map(this::enriquecer).collect(Collectors.toList());
    }
}