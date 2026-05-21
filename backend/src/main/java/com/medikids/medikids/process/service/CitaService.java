package com.medikids.medikids.process.service;

import com.medikids.medikids.expose.model.request.CitaRequest;
import com.medikids.medikids.process.domain.Cita;
import com.medikids.medikids.process.domain.Especialidad;
import com.medikids.medikids.process.domain.Medico;
import com.medikids.medikids.process.domain.Paciente;
import com.medikids.medikids.process.domain.Usuario;
import com.medikids.medikids.process.dto.CitaDto;
import com.medikids.medikids.process.dto.EspecialidadDto;
import com.medikids.medikids.process.dto.MedicoDto;
import com.medikids.medikids.process.dto.PacienteDto;
import com.medikids.medikids.process.dto.UsuarioDto;
import com.medikids.medikids.process.repository.CitaRepository;
import com.medikids.medikids.process.repository.EspecialidadRepository;
import com.medikids.medikids.process.repository.MedicoRepository;
import com.medikids.medikids.process.repository.PacienteRepository;
import com.medikids.medikids.process.repository.UsuarioRepository;
import com.medikids.medikids.utils.config.SimpleCache;
import com.medikids.medikids.utils.helpers.CitaHelper;
import com.medikids.medikids.utils.helpers.EspecialidadHelper;
import com.medikids.medikids.utils.helpers.MedicoHelper;
import com.medikids.medikids.utils.helpers.PacienteHelper;
import com.medikids.medikids.utils.helpers.UsuarioHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
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

    @Autowired
    private SimpleCache<Integer, Medico> medicoEntityCache;

    @Autowired
    private SimpleCache<Integer, Usuario> usuarioEntityCache;

    // Enriquece un solo CitaDto (usado para getById, save, update)
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

    // Enriquece una lista de CitaDto en batch (reduce N+1 a 5 consultas totales)
    private List<CitaDto> enriquecerBatch(List<Cita> citas) {
        if (citas.isEmpty()) return Collections.emptyList();

        List<CitaDto> dtos = CitaHelper.mapAll(citas);

        Set<Integer> medicoIds = new HashSet<>();
        Set<Integer> pacienteIds = new HashSet<>();
        for (CitaDto dto : dtos) {
            medicoIds.add(dto.getId_medico());
            pacienteIds.add(dto.getId_paciente());
        }

        Set<Integer> medicoIdsToFetch = new HashSet<>();
        Map<Integer, Medico> medicoEntities = new HashMap<>();
        for (Integer mid : medicoIds) {
            Medico cached = medicoEntityCache.get(mid);
            if (cached != null) {
                medicoEntities.put(mid, cached);
            } else {
                medicoIdsToFetch.add(mid);
            }
        }
        if (!medicoIdsToFetch.isEmpty()) {
            for (Medico m : medicoRepository.findAllById(medicoIdsToFetch)) {
                medicoEntities.putIfAbsent(m.getId_medico(), m);
                medicoEntityCache.put(m.getId_medico(), m);
            }
        }

        Set<Integer> usuarioIds = new HashSet<>();
        Set<Integer> especialidadIds = new HashSet<>();
        for (Medico m : medicoEntities.values()) {
            usuarioIds.add(m.getId_usuario());
            especialidadIds.add(m.getId_especialidad());
        }

        Set<Integer> usuarioIdsToFetch = new HashSet<>();
        Map<Integer, Usuario> usuarioEntities = new HashMap<>();
        for (Integer uid : usuarioIds) {
            Usuario cached = usuarioEntityCache.get(uid);
            if (cached != null) {
                usuarioEntities.put(uid, cached);
            } else {
                usuarioIdsToFetch.add(uid);
            }
        }
        if (!usuarioIdsToFetch.isEmpty()) {
            for (Usuario u : usuarioRepository.findAllById(usuarioIdsToFetch)) {
                usuarioEntities.putIfAbsent(u.getId_usuario(), u);
                usuarioEntityCache.put(u.getId_usuario(), u);
            }
        }

        Map<Integer, UsuarioDto> usuarioMap = usuarioEntities.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> UsuarioHelper.mapUsuario(e.getValue())));

        Map<Integer, EspecialidadDto> especialidadMap = especialidadRepository.findAllById(especialidadIds).stream()
                .collect(Collectors.toMap(Especialidad::getId_especialidad, EspecialidadHelper::mapEspecialidad));

        Map<Integer, PacienteDto> pacienteMap = pacienteRepository.findAllById(pacienteIds).stream()
                .collect(Collectors.toMap(Paciente::getId_paciente, PacienteHelper::mapPaciente));

        for (CitaDto dto : dtos) {
            Medico medico = medicoEntities.get(dto.getId_medico());
            if (medico != null) {
                MedicoDto medicoDto = MedicoHelper.mapMedico(medico);
                medicoDto.setUsuario(usuarioMap.get(medico.getId_usuario()));
                medicoDto.setEspecialidad(especialidadMap.get(medico.getId_especialidad()));
                dto.setMedico(medicoDto);
            }
            dto.setPaciente(pacienteMap.get(dto.getId_paciente()));
        }

        return dtos;
    }

    public List<CitaDto> getAll() {
        return enriquecerBatch(citaRepository.findAll());
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

    public List<CitaDto> getByPaciente(int id_paciente) {
        return enriquecerBatch(citaRepository.findByIdPaciente(id_paciente));
    }

    public List<CitaDto> getByCliente(int idCliente) {
        return enriquecerBatch(citaRepository.findByCliente(idCliente));
    }

    public CitaDto marcarAsistencia(int id, char asistencia) {
        Optional<Cita> cita = citaRepository.findById(id);
        if (cita.isPresent()) {
            cita.get().setAsistencia(asistencia);
            return enriquecer(CitaHelper.mapCita(citaRepository.save(cita.get())));
        }
        return null;
    }
}
