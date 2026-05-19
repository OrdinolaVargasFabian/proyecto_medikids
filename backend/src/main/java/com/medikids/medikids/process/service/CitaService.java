package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.CitaRequest;
import com.medikids.medikids.process.domain.Cita;
import com.medikids.medikids.process.dto.CitaDto;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.repository.CitaRepository;
import com.medikids.medikids.process.repository.EspecialidadRepository;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.process.repository.PacienteRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.helpers.CitaHelper;
import com.medikids.medikids.utils.helpers.EspecialidadHelper;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import com.medikids.medikids.utils.helpers.PacienteHelper;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    // Enriquece un CitaDto con los datos de su Medico y Paciente
    private CitaDto enriquecer(CitaDto dto) {
        medicoRepository.findById(dto.getId_medico()).ifPresent(medico -> {
            MedicoDto medicoDto = MedicoHelper.mapMedico(medico);
            usuarioRepository.findById(medico.getId_usuario()).ifPresent(usuario ->
                    medicoDto.setUsuario(UsuarioHelper.mapUsuario(usuario))
            );
            especialidadRepository.findById(medico.getId_especialidad()).ifPresent(especialidad ->
                    medicoDto.setEspecialidad(EspecialidadHelper.mapEspecialidad(especialidad))
            );
            dto.setMedico(medicoDto);
        });
        pacienteRepository.findById(dto.getId_paciente()).ifPresent(paciente ->
                dto.setPaciente(PacienteHelper.mapPaciente(paciente))
        );
        return dto;
    }

    public List<CitaDto> getAll() {
        return CitaHelper.mapAll(citaRepository.findAll()).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    public CitaDto getById(int id) {
        Optional<Cita> cita = citaRepository.findById(id);
        return cita.map(c -> enriquecer(CitaHelper.mapCita(c))).orElse(null);
    }

    public CitaDto save(CitaRequest cita) {
        return enriquecer(CitaHelper.mapCita(citaRepository.save(CitaHelper.buildCita(cita))));
    }

    public CitaDto update(int id, CitaRequest cita) {
        Optional<Cita> citaUpdate = citaRepository.findById(id);
        if (citaUpdate.isPresent()) {
            citaUpdate.get().setMotivo(cita.getMotivo());
            citaUpdate.get().setEstado(cita.getEstado());
            citaUpdate.get().setAsistencia(cita.getAsistencia());
            citaUpdate.get().setComentarios(cita.getComentarios());
            citaUpdate.get().setId_horario(cita.getId_horario());
            citaUpdate.get().setId_medico(cita.getId_medico());
            citaUpdate.get().setId_paciente(cita.getId_paciente());
            citaUpdate.get().setFecha_cita(cita.getFecha_cita() != null ? LocalDate.parse(cita.getFecha_cita()) : null);
            citaUpdate.get().setHora_cita(cita.getHora_cita());
            return enriquecer(CitaHelper.mapCita(citaRepository.save(citaUpdate.get())));
        }
        return null;
    }

    // Obtiene todas las citas de un paciente (hijo del cliente)
    public List<CitaDto> getByPaciente(int id_paciente) {
        return CitaHelper.mapAll(citaRepository.findByIdPaciente(id_paciente)).stream()
                .map(this::enriquecer)
                .collect(Collectors.toList());
    }

    // Marca únicamente la asistencia de una cita (0: No, 1: Sí)
    public CitaDto marcarAsistencia(int id, char asistencia) {
        Optional<Cita> cita = citaRepository.findById(id);
        if (cita.isPresent()) {
            cita.get().setAsistencia(asistencia);
            return enriquecer(CitaHelper.mapCita(citaRepository.save(cita.get())));
        }
        return null;
    }
}
