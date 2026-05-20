package com.medikids.medikids.utils.helpers;

import com.medikids.medikids.expose.model.request.HorarioRequest;
import com.medikids.medikids.process.domain.Horario;
import com.medikids.medikids.process.dto.HorarioDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class HorarioHelper implements Serializable {

    private HorarioHelper() {
        throw new IllegalStateException("HorarioHelper class");
    }

    public static HorarioDto mapHorario(Horario horario) {
        return HorarioDto.builder()
                .id_horario(horario.getId_horario())
                .fecha(horario.getFecha())
                .hora_inicio(horario.getHora_inicio())
                .hora_fin(horario.getHora_fin())
                .disponible(horario.getDisponible())
                .id_medico(horario.getId_medico())
                .build();
    }

    public static Horario buildHorario(HorarioRequest horario) {
        return Horario.builder()
                .fecha(horario.getFecha())
                .hora_inicio(horario.getHora_inicio())
                .hora_fin(horario.getHora_fin())
                .disponible(horario.getDisponible())
                .id_medico(horario.getId_medico())
                .build();
    }

    public static List<HorarioDto> mapAll(List<Horario> horarios) {
        return horarios.stream()
                .map(HorarioHelper::mapHorario)
                .collect(Collectors.toList());
    }

    public static Page<HorarioDto> mapPage(Page<Horario> horarioPage) {
        List<HorarioDto> horarios = horarioPage.getContent().stream()
                .map(HorarioHelper::mapHorario)
                .collect(Collectors.toList());
        return new PageImpl<>(horarios);
    }
}
