package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.HistorialClinicoRequest;
import com.medikids.medikids.process.domain.HistorialClinico;
import com.medikids.medikids.process.dto.HistorialClinicoDto;
import com.medikids.medikids.process.repository.HistorialClinicoRepository;
import com.medikids.medikids.utils.helpers.HistorialClinicoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistorialClinicoService {

    @Autowired
    private HistorialClinicoRepository historialClinicoRepository;

    public List<HistorialClinicoDto> getAll() {
        return HistorialClinicoHelper.mapAll(historialClinicoRepository.findAll());
    }

    public HistorialClinicoDto getById(int id) {
        Optional<HistorialClinico> historialClinico = historialClinicoRepository.findById(id);
        return historialClinico.map(HistorialClinicoHelper::mapHistorialClinico).orElse(null);
    }

    public HistorialClinicoDto save(HistorialClinicoRequest historialClinico) {
        return HistorialClinicoHelper.mapHistorialClinico(
                historialClinicoRepository.save(HistorialClinicoHelper.buildHistorialClinico(historialClinico))
        );
    }

    public HistorialClinicoDto update(int id, HistorialClinicoRequest historialClinico) {
        Optional<HistorialClinico> historialUpdate = historialClinicoRepository.findById(id);
        if (historialUpdate.isPresent()) {
            historialUpdate.get().setDiagnostico(historialClinico.getDiagnostico());
            historialUpdate.get().setTratamiento(historialClinico.getTratamiento());
            historialUpdate.get().setObservaciones(historialClinico.getObservaciones());
            historialUpdate.get().setFecha_registro(historialClinico.getFechaRegistro());
            historialUpdate.get().setId_cita(historialClinico.getIdCita());
            historialUpdate.get().setId_paciente(historialClinico.getIdPaciente());

            return HistorialClinicoHelper.mapHistorialClinico(historialClinicoRepository.save(historialUpdate.get()));
        }
        return null;
    }
}