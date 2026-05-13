package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
}