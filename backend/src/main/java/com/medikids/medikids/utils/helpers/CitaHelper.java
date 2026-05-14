package com.medikids.medikids.utils.helpers;

import com.medikids.medikids.expose.model.CItaRequest;
import com.medikids.medikids.process.domain.Cita;
import com.medikids.medikids.process.dto.CitaDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class CitaHelper implements Serializable {
    private CitaHelper() {
        throw new IllegalStateException("CitaHelper class");
    }

    // Convierte una cita "domain" a "dto"
    public static CitaDto mapCita(Cita cita) {
        return CitaDto.builder()
                .id_cita(cita.getId_cita())
                .motivo(cita.getMotivo())
                .fecha_registro(cita.getFecha_registro())
                .estado(cita.getEstado())
                .asistencia(cita.getAsistencia())
                .comentarios(cita.getComentarios())
                .id_horario(cita.getId_horario())
                .id_medico(cita.getId_medico())
                .id_paciente(cita.getId_paciente())
                .build();
    }

    // Convierte una cita "request" a "domain"
    public static Cita buildCita(CItaRequest cita) {
        return Cita.builder()
                .motivo(cita.getMotivo())
                .estado(cita.getEstado())
                .asistencia(cita.getAsistencia())
                .comentarios(cita.getComentarios())
                .id_horario(cita.getId_horario())
                .id_medico(cita.getId_medico())
                .id_paciente(cita.getId_paciente())
                .build();
    }

    // Convierte una lista de citas "domain" a "dto"
    public static List<CitaDto> mapAll(List<Cita> citas) {
        return citas.stream()
                .map(cita -> CitaDto.builder()
                        .id_cita(cita.getId_cita())
                        .motivo(cita.getMotivo())
                        .fecha_registro(cita.getFecha_registro())
                        .estado(cita.getEstado())
                        .asistencia(cita.getAsistencia())
                        .comentarios(cita.getComentarios())
                        .id_horario(cita.getId_horario())
                        .id_medico(cita.getId_medico())
                        .id_paciente(cita.getId_paciente())
                        .build())
                .collect(Collectors.toList());
    }

    // Convierte un page de citas "domain" a "dto"
    public static Page<CitaDto> mapPage(Page<Cita> citaPage) {
        List<CitaDto> citas = citaPage.getContent().stream()
                .map(cita -> CitaDto.builder()
                        .id_cita(cita.getId_cita())
                        .motivo(cita.getMotivo())
                        .fecha_registro(cita.getFecha_registro())
                        .estado(cita.getEstado())
                        .asistencia(cita.getAsistencia())
                        .comentarios(cita.getComentarios())
                        .id_horario(cita.getId_horario())
                        .id_medico(cita.getId_medico())
                        .id_paciente(cita.getId_paciente())
                        .build())
                .collect(Collectors.toList());
        Page<CitaDto> citaPage$ = new PageImpl<CitaDto>(citas);
        return citaPage$;
    }
}
