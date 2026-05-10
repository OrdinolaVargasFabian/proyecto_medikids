package com.medikids.medikids_osorio_backend.process.repository;

import com.medikids.medikids_osorio_backend.process.domain.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {
}