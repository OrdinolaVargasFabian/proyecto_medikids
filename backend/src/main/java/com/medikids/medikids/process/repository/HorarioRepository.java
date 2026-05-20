package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    @Query("SELECT h FROM Horario h WHERE h.id_medico = :idMedico")
    List<Horario> findByMedico(@Param("idMedico") int idMedico);
}
