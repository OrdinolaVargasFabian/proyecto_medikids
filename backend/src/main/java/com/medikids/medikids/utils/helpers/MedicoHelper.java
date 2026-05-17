package com.medikids.medikids.utils.helpers;

import com.medikids.medikids.expose.model.MedicoRequest;
import com.medikids.medikids.process.domain.Medico;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.MedicoDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class MedicoHelper implements Serializable {

    private MedicoHelper() {
        throw new IllegalStateException("MedicoHelper class");
    }

    // Convierte un medico "domain" a "dto"
    public static MedicoDto mapMedico(Medico medico) {
        return MedicoDto.builder()
                .id_medico(medico.getId_medico())
                .nro_colegiatura(medico.getNro_colegiatura())
                .url_foto(medico.getUrl_foto())
                .estado(medico.getEstado().name())
                .id_usuario(medico.getUsuario() != null ? medico.getUsuario().getId_usuario() : 0)
                .id_especialidad(medico.getId_especialidad())
                .build();
    }

    // Convierte un medico "request" a "domain"
    public static Medico buildMedico(MedicoRequest medico) {
        return Medico.builder()
                .id_medico(medico.getId_medico())
                .nro_colegiatura(medico.getNro_colegiatura())
                .url_foto(medico.getUrl_foto())
                .estado(Medico.EstadoMedico.valueOf(medico.getEstado()))
                .usuario(medico.getUsuario() != null ? Usuario.builder().id_usuario(medico.getUsuario().getId_usuario()).build() : null)
                .id_especialidad(medico.getId_especialidad())
                .build();
    }

    // Convierte una lista de medicos "domain" a "dto"
    public static List<MedicoDto> mapAll(List<Medico> medicos) {
        return medicos.stream()
                .map(m -> MedicoDto.builder()
                        .id_medico(m.getId_medico())
                        .nro_colegiatura(m.getNro_colegiatura())
                        .url_foto(m.getUrl_foto())
                        .estado(m.getEstado().name())
                .id_usuario(m.getUsuario() != null ? m.getUsuario().getId_usuario() : 0)
                        .id_especialidad(m.getId_especialidad())
                        .build())
                .collect(Collectors.toList());
    }

    // Convierte un page de medicos "domain" a "dto"
    public static Page<MedicoDto> mapPage(Page<Medico> medicoPage) {

        List<MedicoDto> medicos = medicoPage.getContent().stream()
                .map(m -> MedicoDto.builder()
                        .id_medico(m.getId_medico())
                        .nro_colegiatura(m.getNro_colegiatura())
                        .url_foto(m.getUrl_foto())
                        .estado(m.getEstado().name())
                    .id_usuario(m.getUsuario() != null ? m.getUsuario().getId_usuario() : 0)
                        .id_especialidad(m.getId_especialidad())
                        .build())
                .collect(Collectors.toList());

        return new PageImpl<>(medicos);
    }
}