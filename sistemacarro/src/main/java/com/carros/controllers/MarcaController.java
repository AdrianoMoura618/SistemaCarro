package com.carros.controllers;

import com.carros.models.Marca;
import com.carros.repositories.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/marcas")
public class MarcaController {
    
    @Autowired
    private MarcaRepository marcaRepository;
    
    @GetMapping
    public List<Marca> listarTodas() {
        return marcaRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Marca> buscarPorId(@PathVariable Long id) {
        return marcaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Marca criar(@RequestBody Marca marca) {
        return marcaRepository.save(marca);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Marca> atualizar(@PathVariable Long id, @RequestBody Marca marca) {
        if (!marcaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        marca.setId(id);
        return ResponseEntity.ok(marcaRepository.save(marca));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!marcaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        marcaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}