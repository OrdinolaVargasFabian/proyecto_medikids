package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.ClienteRequest;
import com.medikids.medikids.process.domain.Cliente;
import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.repository.ClienteRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.ClienteHelper;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Enriquece un ClienteDto con los datos de su Usuario
    private ClienteDto enriquecer(ClienteDto dto) {
        usuarioRepository.findById(dto.getId_usuario()).ifPresent(usuario ->
                dto.setUsuario(UsuarioHelper.mapUsuario(usuario))
        );
        return dto;
    }

    public List<ClienteDto> getAll() {
        return ClienteHelper.mapAll(clienteRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public ClienteDto getById(int id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        return cliente.map(c -> enriquecer(ClienteHelper.mapCliente(c))).orElse(null);
    }

    public ClienteDto getByIdUsuario(int idUsuario) {
        Optional<Cliente> cliente = clienteRepository.findByIdUsuario(idUsuario);
        return cliente.map(c -> enriquecer(ClienteHelper.mapCliente(c))).orElse(null);
    }

    public ClienteDto save(ClienteRequest cliente) {
        return enriquecer(ClienteHelper.mapCliente(clienteRepository.save(ClienteHelper.buildCliente(cliente))));
    }

    public ClienteDto update(int id, ClienteRequest cliente) {
        Optional<Cliente> clienteUpdate = clienteRepository.findById(id);
        if (clienteUpdate.isPresent()) {
            clienteUpdate.get().setDni_responsable(cliente.getDni_responsable());
            clienteUpdate.get().setDireccion(cliente.getDireccion());
            return enriquecer(ClienteHelper.mapCliente(clienteRepository.save(clienteUpdate.get())));
        }
        return null;
    }

    public ClienteDto getByDni(String dni) {
        Optional<Cliente> cliente = clienteRepository.findByDni(dni);
        return cliente.map(c -> enriquecer(ClienteHelper.mapCliente(c))).orElse(null);
    }

    public List<ClienteDto> getByNombre(String nombre) {
        return ClienteHelper.mapAll(
            clienteRepository.findAll().stream()
                .filter(cliente -> cliente.getUsuario().getNombres().toLowerCase().contains(nombre.toLowerCase())
                || cliente.getUsuario().getApellidos().toLowerCase().contains(nombre.toLowerCase()))
                .toList()
        ).stream().map(this::enriquecer).collect(Collectors.toList());
    }
}
