package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// La libreria provee a las consultas, no es necesario hacerlas.
public interface CitaRepository extends JpaRepository<Cita, Long> {}
