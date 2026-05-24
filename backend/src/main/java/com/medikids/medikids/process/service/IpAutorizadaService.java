package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.IpAutorizadaRequest;
import com.medikids.medikids.process.domain.IpAutorizada;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.IpAutorizadaDto;
import com.medikids.medikids.process.repository.IpAutorizadaRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.IpAutorizadaHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IpAutorizadaService {

    @Autowired
    private IpAutorizadaRepository ipAutorizadaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<IpAutorizadaDto> getAll() {
        return IpAutorizadaHelper.mapAll(ipAutorizadaRepository.findAll());
    }

    public List<IpAutorizadaDto> getByUsuario(int idUsuario) {
        return IpAutorizadaHelper.mapAll(ipAutorizadaRepository.findAll().stream()
                .filter(ipAutorizada -> ipAutorizada.getUsuario() != null
                        && ipAutorizada.getUsuario().getId_usuario() == idUsuario
                        && ipAutorizada.isActivo())
                .collect(Collectors.toList()));
    }

    public IpAutorizadaDto getById(int id) {
        Optional<IpAutorizada> ipAutorizada = ipAutorizadaRepository.findById(id);
        return ipAutorizada.filter(IpAutorizada::isActivo)
                .map(IpAutorizadaHelper::mapIpAutorizada)
                .orElse(null);
    }

    public IpAutorizadaDto save(IpAutorizadaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                .orElseThrow(() -> new RuntimeException("El usuario no existe"));

        String ipNormalizada = normalizarIp(request.getIp());
        boolean duplicada = ipAutorizadaRepository.findAll().stream()
                .anyMatch(ipAutorizada -> ipAutorizada.getUsuario() != null
                        && ipAutorizada.getUsuario().getId_usuario() == usuario.getId_usuario()
                        && ipAutorizada.isActivo()
                        && ipNormalizada.equals(normalizarIp(ipAutorizada.getIp())));

        if (duplicada) {
            throw new RuntimeException("La IP ya está registrada para este usuario");
        }

        IpAutorizada ipAutorizada = IpAutorizadaHelper.buildIpAutorizada(request);
        ipAutorizada.setUsuario(usuario);
        ipAutorizada.setIp(ipNormalizada);
        ipAutorizada.setActivo(request.getActivo() == null || request.getActivo());

        return IpAutorizadaHelper.mapIpAutorizada(ipAutorizadaRepository.save(ipAutorizada));
    }

    public IpAutorizadaDto update(int id, IpAutorizadaRequest request) {
        Optional<IpAutorizada> ipAutorizadaOpt = ipAutorizadaRepository.findById(id);
        if (ipAutorizadaOpt.isEmpty()) {
            return null;
        }

        IpAutorizada ipAutorizada = ipAutorizadaOpt.get();
        ipAutorizada.setIp(normalizarIp(request.getIp()));
        ipAutorizada.setDescripcion(request.getDescripcion());
        if (request.getActivo() != null) {
            ipAutorizada.setActivo(request.getActivo());
        }
        ipAutorizada.setFecha_modificado(new Date());

        return IpAutorizadaHelper.mapIpAutorizada(ipAutorizadaRepository.save(ipAutorizada));
    }

    public Boolean delete(int id) {
        Optional<IpAutorizada> ipAutorizadaOpt = ipAutorizadaRepository.findById(id);
        if (ipAutorizadaOpt.isEmpty()) {
            return Boolean.FALSE;
        }

        IpAutorizada ipAutorizada = ipAutorizadaOpt.get();
        ipAutorizada.setActivo(false);
        ipAutorizada.setFecha_modificado(new Date());
        ipAutorizadaRepository.save(ipAutorizada);
        return Boolean.TRUE;
    }

    public boolean isIpAutorizada(int idUsuario, String ip) {
        List<IpAutorizada> ipsAutorizadas = ipAutorizadaRepository.findAll().stream()
                .filter(ipAutorizada -> ipAutorizada.getUsuario() != null
                        && ipAutorizada.getUsuario().getId_usuario() == idUsuario
                        && ipAutorizada.isActivo())
                .collect(Collectors.toList());

        if (ipsAutorizadas.isEmpty()) {
            return true;
        }

        String ipNormalizada = normalizarIp(ip);
        return ipsAutorizadas.stream()
                .anyMatch(ipAutorizada -> ipNormalizada.equals(normalizarIp(ipAutorizada.getIp())));
    }

    private String normalizarIp(String ip) {
        if (ip == null) {
            return "";
        }

        String ipNormalizada = ip.trim();
        if (ipNormalizada.startsWith("::ffff:")) {
            return ipNormalizada.substring(7);
        }

        return ipNormalizada;
    }

}