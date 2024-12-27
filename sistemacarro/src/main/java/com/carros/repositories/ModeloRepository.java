package com.carros.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.carros.models.Modelo;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo, Long> {
}
