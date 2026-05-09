package com.medikids.medikids.process.service;

import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.repository.ClienteRepository;
import com.medikids.medikids.utils.helpers.ClienteHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteDto> getAll() {
        return ClienteHelper.mapAll(clienteRepository.findAll());
    }
}
