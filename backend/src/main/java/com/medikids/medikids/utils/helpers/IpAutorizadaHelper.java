package com.medikids.medikids.utils.helpers;

import com.medikids.medikids.expose.model.request.IpAutorizadaRequest;
import com.medikids.medikids.process.domain.IpAutorizada;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.IpAutorizadaDto;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class IpAutorizadaHelper implements Serializable {
    private IpAutorizadaHelper() {
        throw new IllegalStateException("IpAutorizadaHelper class");
    }

    public static IpAutorizadaDto mapIpAutorizada(IpAutorizada ipAutorizada) {
        return IpAutorizadaDto.builder()
                .id_ip_autorizada(ipAutorizada.getId_ip_autorizada())
                .id_usuario(ipAutorizada.getUsuario() != null ? ipAutorizada.getUsuario().getId_usuario() : 0)
                .ip(ipAutorizada.getIp())
                .descripcion(ipAutorizada.getDescripcion())
                .activo(ipAutorizada.isActivo())
                .fecha_registro(ipAutorizada.getFecha_registro())
                .fecha_modificado(ipAutorizada.getFecha_modificado())
                .build();
    }

    public static IpAutorizada buildIpAutorizada(IpAutorizadaRequest request) {
        return IpAutorizada.builder()
                .ip(request.getIp())
                .descripcion(request.getDescripcion())
                .activo(request.getActivo() == null || request.getActivo())
                .usuario(Usuario.builder().id_usuario(request.getId_usuario()).build())
                .build();
    }

    public static List<IpAutorizadaDto> mapAll(List<IpAutorizada> ipAutorizadas) {
        return ipAutorizadas.stream()
                .map(IpAutorizadaHelper::mapIpAutorizada)
                .collect(Collectors.toList());
    }
}