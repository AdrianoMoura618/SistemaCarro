package com.carros.repositories;

import com.carros.models.Carro;
import com.carros.models.StatusDisponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarroRepository extends JpaRepository<Carro, Long> {
    List<Carro> findByStatusDisponibilidade(StatusDisponibilidade statusDisponibilidade);
}