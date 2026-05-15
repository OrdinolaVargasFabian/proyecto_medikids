package com.medikids.medikids.process.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medikids.medikids.process.domain.Paciente;

@Repository
// La librería provee las consultas básicas, no es necesario implementarlas.
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
}