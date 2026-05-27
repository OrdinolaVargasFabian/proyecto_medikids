package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    @Query(value = "SELECT p.* FROM pago p INNER JOIN cita c ON p.id_cita = c.id_cita INNER JOIN paciente pac ON c.id_paciente = pac.id_paciente WHERE pac.id_cliente = :idCliente", nativeQuery = true)
    List<Pago> findByCliente(@Param("idCliente") int idCliente);
}