package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.PagoRequest;
import com.medikids.medikids.process.dto.PagoDto;
import com.medikids.medikids.process.repository.CitaRepository;
import com.medikids.medikids.process.repository.PagoRepository;
import com.medikids.medikids.utils.helpers.CitaHelper;
import com.medikids.medikids.utils.helpers.PagoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private CitaRepository citaRepository;

    // Enriquece un PagoDto con los datos de su Cita
    private PagoDto enriquecer(PagoDto dto) {
        citaRepository.findById(dto.getId_cita()).ifPresent(cita ->
                dto.setCita(CitaHelper.mapCita(cita))
        );
        return dto;
    }

    public List<PagoDto> listarPagos() {
        return PagoHelper.mapAll(pagoRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public PagoDto guardarPago(PagoRequest pago) {
        return enriquecer(PagoHelper.mapPago(pagoRepository.save(PagoHelper.buildPago(pago))));
    }

    public List<PagoDto> listarPagosPorCliente(int idCliente) {
        return PagoHelper.mapAll(pagoRepository.findByCliente(idCliente)).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }
}