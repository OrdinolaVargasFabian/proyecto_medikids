package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// La libreria provee a las consultas, no es necesario hacerlas.
public interface CitaRepository extends JpaRepository<Cita, Integer> {

    // Busca todas las citas asociadas a un paciente (hijo del cliente)
    // nativeQuery=true usa SQL puro para evitar conflictos del parser JPQL con snake_case
    @Query(value = "SELECT * FROM Cita WHERE id_paciente = :idPaciente", nativeQuery = true)
    List<Cita> findByIdPaciente(@Param("idPaciente") int idPaciente);
}

