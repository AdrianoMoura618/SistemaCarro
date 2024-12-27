package com.carros.controllers;

import com.carros.models.Carro;
import com.carros.models.StatusDisponibilidade;
import com.carros.repositories.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/carros")
public class CarroController {
    
    @Autowired
    private CarroRepository carroRepository;
    
    @GetMapping
    public List<Carro> listarTodos() {
        return carroRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscarPorId(@PathVariable Long id) {
        return carroRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Carro criar(@RequestBody Carro carro) {
        return carroRepository.save(carro);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizar(@PathVariable Long id, @RequestBody Carro carro) {
        if (!carroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        carro.setId(id);
        return ResponseEntity.ok(carroRepository.save(carro));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!carroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        carroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/disponiveis")
    public List<Carro> listarDisponiveis() {
        return carroRepository.findByStatusDisponibilidade(StatusDisponibilidade.Disponível);
    }
}
