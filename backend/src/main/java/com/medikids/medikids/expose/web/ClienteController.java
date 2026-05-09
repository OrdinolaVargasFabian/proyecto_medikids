package com.medikids.medikids.expose.web;

import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cliente")
@RequiredArgsConstructor
public class ClienteController {
    @Autowired
    private final ClienteService clienteService;

    @GetMapping("/all")
    public List<ClienteDto> all() {
        return clienteService.getAll();
    }
}
