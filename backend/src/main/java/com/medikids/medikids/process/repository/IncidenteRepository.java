package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Incidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {
}