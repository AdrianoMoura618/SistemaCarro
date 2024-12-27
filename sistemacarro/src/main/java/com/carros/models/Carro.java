package com.carros.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "carro")
public class Carro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_modelo", nullable = false)
    private Modelo modelo;
    
    @Column(name = "ano_fabricacao", nullable = false)
    private Integer anoFabricacao;
    
    @Column(nullable = false)
    private String cor;
    
    @Column(nullable = false)
    private BigDecimal preco;
    
    @Column(nullable = false)
    private Integer quilometragem;
    
    @Column(name = "url_imagem")
    private String urlImagem;
    
    @Column(name = "status_disponibilidade", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusDisponibilidade statusDisponibilidade;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Modelo getModelo() {
        return modelo;
    }
    
    public void setModelo(Modelo modelo) {
        this.modelo = modelo;
    }
    
    public Integer getAnoFabricacao() {
        return anoFabricacao;
    }
    
    public void setAnoFabricacao(Integer anoFabricacao) {
        this.anoFabricacao = anoFabricacao;
    }
    
    public String getCor() {
        return cor;
    }
    
    public void setCor(String cor) {
        this.cor = cor;
    }
    
    public BigDecimal getPreco() {
        return preco;
    }
    
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
    
    public Integer getQuilometragem() {
        return quilometragem;
    }
    
    public void setQuilometragem(Integer quilometragem) {
        this.quilometragem = quilometragem;
    }
    
    public StatusDisponibilidade getStatusDisponibilidade() {
        return statusDisponibilidade;
    }
    
    public void setStatusDisponibilidade(StatusDisponibilidade statusDisponibilidade) {
        this.statusDisponibilidade = statusDisponibilidade;
    }

	public String getUrlImagem() {
		return urlImagem;
	}

	public void setUrlImagem(String urlImagem) {
		this.urlImagem = urlImagem;
	}
}
