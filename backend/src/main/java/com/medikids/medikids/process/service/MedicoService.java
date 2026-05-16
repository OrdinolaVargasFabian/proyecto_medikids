package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.process.domain.Medico;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    public List<MedicoDto> getAll() {
        return MedicoHelper.mapAll(medicoRepository.findAll());
    }

    public MedicoDto getById(int id) {
        Optional<Medico> medico = medicoRepository.findById((long) id);
        return medico.map(MedicoHelper::mapMedico).orElse(null);
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

            medicoUpdate.get().setEstado(
                    Medico.EstadoMedico.valueOf(medico.getEstado())
            );

            medicoUpdate.get().setId_usuario(medico.getId_usuario());
            medicoUpdate.get().setId_especialidad(medico.getId_especialidad());

            return MedicoHelper.mapMedico(
                    medicoRepository.save(medicoUpdate.get())
            );
        }

        return null;
    }
}