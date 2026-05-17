package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.AsistenciaRequest;
import com.medikids.medikids.expose.model.CItaRequest;
import com.medikids.medikids.process.domain.Cita;
import com.medikids.medikids.process.dto.CitaDto;
import com.medikids.medikids.process.repository.CitaRepository;
import com.medikids.medikids.utils.helpers.CitaHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    public List<CitaDto> getAll() {
        return CitaHelper.mapAll(citaRepository.findAll());
    }

    public CitaDto getById(int id) {
        Optional<Cita> cita = citaRepository.findById((long) id);
        return cita.map(CitaHelper::mapCita).orElse(null);
    }

    public CitaDto save(CItaRequest cita) {
        return CitaHelper.mapCita(citaRepository.save(CitaHelper.buildCita(cita)));
    }

    public CitaDto update(int id, CItaRequest cita) {
        Optional<Cita> citaUpdate = citaRepository.findById((long) id);
        if (citaUpdate.isPresent()) {
            citaUpdate.get().setMotivo(cita.getMotivo());
            citaUpdate.get().setEstado(cita.getEstado());
            citaUpdate.get().setAsistencia(cita.getAsistencia());
            citaUpdate.get().setComentarios(cita.getComentarios());
            citaUpdate.get().setId_horario(cita.getId_horario());
            citaUpdate.get().setId_medico(cita.getId_medico());
            citaUpdate.get().setId_paciente(cita.getId_paciente());

            return CitaHelper.mapCita(citaRepository.save(citaUpdate.get()));
        }
        return null;
    }

    // Obtiene todas las citas de un paciente (hijo del cliente)
    public List<CitaDto> getByPaciente(int id_paciente) {
        return CitaHelper.mapAll(citaRepository.findByIdPaciente(id_paciente));
    }

    // Marca únicamente la asistencia de una cita (operación atómica para la HU)
    public CitaDto marcarAsistencia(int id, AsistenciaRequest request) {
        Optional<Cita> cita = citaRepository.findById((long) id);
        if (cita.isPresent()) {
            cita.get().setAsistencia(request.getAsistencia());
            return CitaHelper.mapCita(citaRepository.save(cita.get()));
        }
        return null;
    }
}

