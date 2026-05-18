package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.HorarioAtencion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioAtencionRepository extends JpaRepository<HorarioAtencion, Integer> {
}