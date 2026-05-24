package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.PacienteRequest;
import com.medikids.medikids.process.domain.Cliente;
import com.medikids.medikids.process.domain.Paciente;
import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.dto.PacienteDto;
import com.medikids.medikids.process.repository.ClienteRepository;
import com.medikids.medikids.process.repository.PacienteRepository;
import com.medikids.medikids.utils.helpers.ClienteHelper;
import com.medikids.medikids.utils.helpers.PacienteHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PacienteService {
    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private PacienteDto enriquecer(PacienteDto dto) {
        clienteRepository.findById(dto.getId_cliente()).ifPresent(cliente ->
                dto.setCliente(ClienteHelper.mapCliente(cliente))
        );
        return dto;
    }

    private List<PacienteDto> enriquecerBatch(List<Paciente> pacientes) {
        if (pacientes.isEmpty()) return Collections.emptyList();

        List<PacienteDto> dtos = PacienteHelper.mapAll(pacientes);

        Set<Integer> clienteIds = new HashSet<>();
        for (PacienteDto dto : dtos) {
            clienteIds.add(dto.getId_cliente());
        }

        Map<Integer, ClienteDto> clienteMap = clienteRepository.findAllById(clienteIds).stream()
                .collect(Collectors.toMap(Cliente::getId_cliente, ClienteHelper::mapCliente));

        for (PacienteDto dto : dtos) {
            dto.setCliente(clienteMap.get(dto.getId_cliente()));
        }

        return dtos;
    }

    public List<PacienteDto> getAll() {
        return enriquecerBatch(pacienteRepository.findAll());
    }

    public List<PacienteDto> getByIdCliente(int idCliente) {
        return enriquecerBatch(pacienteRepository.findByIdCliente(idCliente));
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
