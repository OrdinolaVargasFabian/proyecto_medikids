package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.IncidenteRequest;
import com.medikids.medikids.process.domain.Incidente;
import com.medikids.medikids.process.dto.IncidenteDto;
import com.medikids.medikids.process.repository.IncidenteRepository;
import com.medikids.medikids.utils.helpers.IncidenteHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidenteService {

    @Autowired
    private IncidenteRepository incidenteRepository;

    public List<IncidenteDto> getAll() {
        return IncidenteHelper.mapAll(incidenteRepository.findAll());
    }

    public IncidenteDto getById(int id) {
        Optional<Incidente> incidente = incidenteRepository.findById((long) id);
        return incidente.map(IncidenteHelper::mapIncidente).orElse(null);
    }

    public IncidenteDto save(IncidenteRequest incidente) {
        return IncidenteHelper.mapIncidente(
                incidenteRepository.save(IncidenteHelper.buildIncidente(incidente))
        );
    }

    public IncidenteDto update(int id, IncidenteRequest incidente) {
        Optional<Incidente> incidenteUpdate = incidenteRepository.findById((long) id);
        if (incidenteUpdate.isPresent()) {
            incidenteUpdate.get().setTipo_incidente(incidente.getTipo_incidente());
            incidenteUpdate.get().setDescripcion(incidente.getDescripcion());
            incidenteUpdate.get().setRespuesta_admin(incidente.getRespuesta_admin());
            incidenteUpdate.get().setFecha_registro(incidente.getFecha_registro());
            incidenteUpdate.get().setId_medico(incidente.getId_medico());

            return IncidenteHelper.mapIncidente(
                    incidenteRepository.save(incidenteUpdate.get())
            );
        }
        return null;
    }
}