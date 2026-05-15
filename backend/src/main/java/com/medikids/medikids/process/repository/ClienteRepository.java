package com.medikids.medikids.process.repository;

import com.medikids.medikids.process.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// La libreria provee a las consultas, no es necesario hacerlas.
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Consulta personalizada para buscar por dni
    public java.util.Optional<Cliente> findByDni(String dni);
}
