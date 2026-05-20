package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.HorarioRequest;
import com.medikids.medikids.process.domain.Horario;
import com.medikids.medikids.process.dto.HorarioDto;
import com.medikids.medikids.process.repository.HorarioRepository;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.utils.helpers.HorarioHelper;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    // Enriquece un HorarioDto con los datos de su Medico
    private HorarioDto enriquecer(HorarioDto dto) {
        medicoRepository.findById(dto.getId_medico()).ifPresent(medico ->
                dto.setMedico(MedicoHelper.mapMedico(medico))
        );
        return dto;
    }

    public List<HorarioDto> getAll() {
        return HorarioHelper.mapAll(horarioRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public HorarioDto getById(int id) {
        return horarioRepository.findById(id)
                .map(HorarioHelper::mapHorario)
                .map(this::enriquecer)
                .orElse(null);
    }

    public HorarioDto save(HorarioRequest horario) {
        return enriquecer(HorarioHelper.mapHorario(
                horarioRepository.save(HorarioHelper.buildHorario(horario))
        ));
    }

    public HorarioDto update(int id, HorarioRequest horario) {
        Optional<Horario> horarioUpdate = horarioRepository.findById(id);
        if (horarioUpdate.isPresent()) {
            horarioUpdate.get().setFecha(horario.getFecha());
            horarioUpdate.get().setHora_inicio(horario.getHora_inicio());
            horarioUpdate.get().setHora_fin(horario.getHora_fin());
            horarioUpdate.get().setDisponible(horario.getDisponible());
            horarioUpdate.get().setId_medico(horario.getId_medico());

            return enriquecer(HorarioHelper.mapHorario(horarioRepository.save(horarioUpdate.get())));
        }
        return null;
    }

    /**
     * Lista todos los horarios de un médico específico.
     */
    public List<HorarioDto> getByMedico(int idMedico) {
        return HorarioHelper.mapAll(horarioRepository.findByMedico(idMedico)).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    /**
     * Registra horarios divididos en bloques de 1 hora.
     * Si el rango total no es exacto (ej: 2.5 horas), solo se registran
     * las horas completas (ej: 2 bloques de 1 hora).
     */
    public List<HorarioDto> saveBloquesDeUnaHora(HorarioRequest horario) {
        Time horaInicio = horario.getHora_inicio();
        Time horaFin = horario.getHora_fin();

        // Calcular la diferencia en milisegundos y obtener las horas completas
        long diffMs = horaFin.getTime() - horaInicio.getTime();
        int horasCompletas = (int) (diffMs / (1000 * 60 * 60));

        if (horasCompletas <= 0) {
            throw new RuntimeException("El rango de horas debe ser mayor a 0. Hora inicio: " + horaInicio + ", Hora fin: " + horaFin);
        }

        List<Horario> bloques = new ArrayList<>();

        for (int i = 0; i < horasCompletas; i++) {
            // Calcular hora_inicio del bloque: horaInicio + i horas
            Calendar calInicio = Calendar.getInstance();
            calInicio.setTime(horaInicio);
            calInicio.add(Calendar.HOUR_OF_DAY, i);

            // Calcular hora_fin del bloque: horaInicio + (i+1) horas
            Calendar calFin = Calendar.getInstance();
            calFin.setTime(horaInicio);
            calFin.add(Calendar.HOUR_OF_DAY, i + 1);

            Horario bloque = Horario.builder()
                    .fecha(horario.getFecha())
                    .hora_inicio(new Time(calInicio.getTimeInMillis()))
                    .hora_fin(new Time(calFin.getTimeInMillis()))
                    .disponible('1')
                    .id_medico(horario.getId_medico())
                    .build();

            bloques.add(bloque);
        }

        List<Horario> guardados = horarioRepository.saveAll(bloques);

        return HorarioHelper.mapAll(guardados).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }
}
