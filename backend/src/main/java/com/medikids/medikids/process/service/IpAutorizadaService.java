package com.medikids.medikids.process.service;

import com.medikids.medikids.process.domain.IpAutorizada;
import com.medikids.medikids.process.repository.IpAutorizadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IpAutorizadaService {

    @Autowired
    private IpAutorizadaRepository ipAutorizadaRepository;

    public boolean isIpAuthorized(String ip) {
        return ipAutorizadaRepository.existsByIpAndActivoTrue(ip);
    }

    public List<IpAutorizada> listarTodas() {
        return ipAutorizadaRepository.findAll();
    }

    public Optional<IpAutorizada> buscarPorId(Integer id) {
        return ipAutorizadaRepository.findById(id);
    }

    public IpAutorizada guardar(IpAutorizada ipAutorizada) {
        return ipAutorizadaRepository.save(ipAutorizada);
    }

    public void eliminar(Integer id) {
        ipAutorizadaRepository.deleteById(id);
    }
}
