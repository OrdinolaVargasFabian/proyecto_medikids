package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.PacienteRequest;
import com.medikids.medikids.process.domain.Paciente;
import com.medikids.medikids.process.dto.PacienteDto;
import com.medikids.medikids.process.repository.PacienteRepository;
import com.medikids.medikids.utils.helpers.PacienteHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {
    @Autowired
    private PacienteRepository pacienteRepository;

    public List<PacienteDto> getAll() {
        return PacienteHelper.mapAll(pacienteRepository.findAll());
    }

    public PacienteDto getById(int id) {
        Optional<Paciente> paciente = pacienteRepository.findById((long) id);
        return paciente.map(PacienteHelper::mapPaciente).orElse(null);
    }

    public PacienteDto save(PacienteRequest paciente) {
        return PacienteHelper.mapPaciente(
                pacienteRepository.save(PacienteHelper.buildPaciente(paciente))
        );
    }

    public PacienteDto update(int id, PacienteRequest paciente) {
        Optional<Paciente> pacienteUpdate = pacienteRepository.findById((long) id);
        if (pacienteUpdate.isPresent()) {
            pacienteUpdate.get().setNombre_completo(paciente.getNombre_completo());
            pacienteUpdate.get().setDni_menor(paciente.getDni_menor());
            pacienteUpdate.get().setFecha_nacimiento(paciente.getFecha_nacimiento());
            pacienteUpdate.get().setId_cliente(paciente.getId_cliente());

            return PacienteHelper.mapPaciente(
                    pacienteRepository.save(pacienteUpdate.get())
            );
        }
        return null;
    }
}