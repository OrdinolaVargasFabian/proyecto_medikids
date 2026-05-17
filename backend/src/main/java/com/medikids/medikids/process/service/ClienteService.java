package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.ClienteRequest;
import com.medikids.medikids.process.domain.Cliente;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.ClienteDto;
import com.medikids.medikids.process.repository.ClienteRepository;
import com.medikids.medikids.utils.helpers.ClienteHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteDto> getAll() {
        return ClienteHelper.mapAll(clienteRepository.findAll());
    }

    public ClienteDto getById(int id) {
        Optional<Cliente> cliente = clienteRepository.findById((long) id);
        return cliente.map(ClienteHelper::mapCliente).orElse(null);
    }

    public ClienteDto getByIdUsuario(int idUsuario) {
        Optional<Cliente> cliente = clienteRepository.findByIdUsuario(idUsuario);
        return cliente.map(ClienteHelper::mapCliente).orElse(null);
    }

    public ClienteDto save(ClienteRequest cliente) {
        return ClienteHelper.mapCliente(clienteRepository.save(ClienteHelper.buildCliente(cliente)));
    }

    public ClienteDto update(int id, ClienteRequest cliente) {
        Optional<Cliente> clienteUpdate = clienteRepository.findById((long) id);
        if (clienteUpdate.isPresent()) {
            clienteUpdate.get().setDni_responsable(cliente.getDni_responsable());
            clienteUpdate.get().setDireccion(cliente.getDireccion());

            return ClienteHelper.mapCliente(clienteRepository.save(clienteUpdate.get()));
        }
        return null;
    }

    public ClienteDto getByDni(String dni) {
        Optional<Cliente> cliente = clienteRepository.findByDni(dni);
        return cliente.map(ClienteHelper::mapCliente).orElse(null);
    }

    public List<ClienteDto> getByNombre(String nombre) {
        return ClienteHelper.mapAll(
            clienteRepository.findAll().stream()
                .filter(cliente -> cliente.getUsuario().getNombres().toLowerCase().contains(nombre.toLowerCase())
                || cliente.getUsuario().getApellidos().toLowerCase().contains(nombre.toLowerCase()))
                .toList()
        );
    }

}
