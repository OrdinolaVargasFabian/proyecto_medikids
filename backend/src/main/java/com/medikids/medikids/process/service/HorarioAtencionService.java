package com.medikids.medikids.process.service;

import com.medikids.medikids.process.domain.HorarioAtencion;
import com.medikids.medikids.process.repository.HorarioAtencionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioAtencionService {

    @Autowired
    private HorarioAtencionRepository repository;

    public List<HorarioAtencion> listar() {
        return repository.findAll();
    }

    public HorarioAtencion guardar(HorarioAtencion horario) {
        return repository.save(horario);
    }
}