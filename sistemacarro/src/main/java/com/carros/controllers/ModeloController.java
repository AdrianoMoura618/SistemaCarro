package com.carros.controllers;

import com.carros.models.Modelo;
import com.carros.repositories.ModeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/modelos")
public class ModeloController {
    
    @Autowired
    private ModeloRepository modeloRepository;
    
    @GetMapping
    public List<Modelo> listarTodos() {
        return modeloRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Modelo> buscarPorId(@PathVariable Long id) {
        return modeloRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Modelo criar(@RequestBody Modelo modelo) {
        return modeloRepository.save(modelo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Modelo> atualizar(@PathVariable Long id, @RequestBody Modelo modelo) {
        if (!modeloRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        modelo.setId(id);
        return ResponseEntity.ok(modeloRepository.save(modelo));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!modeloRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        modeloRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
