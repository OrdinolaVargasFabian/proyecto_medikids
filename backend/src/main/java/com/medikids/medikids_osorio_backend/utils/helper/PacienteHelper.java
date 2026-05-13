package com.medikids.medikids_osorio_backend.utils.helper;

import com.medikids.medikids_osorio_backend.expose.model.PacienteRequest;
import com.medikids.medikids_osorio_backend.process.domain.Paciente;
import com.medikids.medikids_osorio_backend.process.dto.PacienteDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class PacienteHelper implements Serializable {
    private PacienteHelper() {
        throw new IllegalStateException("PacienteHelper class");
    }

    // Convierte un paciente "domain" a "dto"
    public static PacienteDto mapPaciente(Paciente paciente) {
        return PacienteDto.builder()
                .id_paciente(paciente.getId_paciente())
                .nombre_completo(paciente.getNombre_completo())
                .dni_menor(paciente.getDni_menor())
                .fecha_nacimiento(paciente.getFecha_nacimiento())
                .id_cliente(paciente.getId_cliente())
                .build();
    }

    // Convierte un paciente "request" a "domain"
    public static Paciente buildPaciente(PacienteRequest paciente) {
        return Paciente.builder()
                .id_paciente(paciente.getId_paciente())
                .nombre_completo(paciente.getNombre_completo())
                .dni_menor(paciente.getDni_menor())
                .fecha_nacimiento(paciente.getFecha_nacimiento())
                .id_cliente(paciente.getId_cliente())
                .build();
    }

    // Convierte una lista de pacientes "domain" a "dto"
    public static List<PacienteDto> mapAll(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(p -> PacienteDto.builder()
                        .id_paciente(p.getId_paciente())
                        .nombre_completo(p.getNombre_completo())
                        .dni_menor(p.getDni_menor())
                        .fecha_nacimiento(p.getFecha_nacimiento())
                        .id_cliente(p.getId_cliente())
                        .build())
                .collect(Collectors.toList());
    }

    // Convierte un page de pacientes "domain" a "dto"
    public static Page<PacienteDto> mapPage(Page<Paciente> pacientePage) {
        List<PacienteDto> pacientes = pacientePage.getContent().stream()
                .map(p -> PacienteDto.builder()
                        .id_paciente(p.getId_paciente())
                        .nombre_completo(p.getNombre_completo())
                        .dni_menor(p.getDni_menor())
                        .fecha_nacimiento(p.getFecha_nacimiento())
                        .id_cliente(p.getId_cliente())
                        .build())
                .collect(Collectors.toList());
        return new PageImpl<>(pacientes);
    }
}