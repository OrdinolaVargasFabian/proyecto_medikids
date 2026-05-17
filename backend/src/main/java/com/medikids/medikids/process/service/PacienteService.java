package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.PacienteRequest;
import com.medikids.medikids.process.domain.Paciente;
import com.medikids.medikids.process.dto.PacienteDto;
import com.medikids.medikids.process.repository.ClienteRepository;
import com.medikids.medikids.process.repository.PacienteRepository;
import com.medikids.medikids.utils.helpers.ClienteHelper;
import com.medikids.medikids.utils.helpers.PacienteHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PacienteService {
    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // Enriquece un PacienteDto con los datos de su Cliente
    private PacienteDto enriquecer(PacienteDto dto) {
        clienteRepository.findById(dto.getId_cliente()).ifPresent(cliente ->
                dto.setCliente(ClienteHelper.mapCliente(cliente))
        );
        return dto;
    }

    public List<PacienteDto> getAll() {
        return PacienteHelper.mapAll(pacienteRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public PacienteDto getById(int id) {
        Optional<Paciente> paciente = pacienteRepository.findById(id);
        return paciente.map(p -> enriquecer(PacienteHelper.mapPaciente(p))).orElse(null);
    }

    public PacienteDto save(PacienteRequest paciente) {
        return enriquecer(PacienteHelper.mapPaciente(
                pacienteRepository.save(PacienteHelper.buildPaciente(paciente))
        ));
    }

    public PacienteDto update(int id, PacienteRequest paciente) {
        Optional<Paciente> pacienteUpdate = pacienteRepository.findById(id);
        if (pacienteUpdate.isPresent()) {
            pacienteUpdate.get().setNombre_completo(paciente.getNombre_completo());
            pacienteUpdate.get().setDni_menor(paciente.getDni_menor());
            pacienteUpdate.get().setFecha_nacimiento(paciente.getFecha_nacimiento());
            pacienteUpdate.get().setId_cliente(paciente.getId_cliente());
            return enriquecer(PacienteHelper.mapPaciente(
                    pacienteRepository.save(pacienteUpdate.get())
            ));
        }
        return null;
    }
}