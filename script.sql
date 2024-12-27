-- Criar tabela de marcas
CREATE TABLE marca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Criar tabela de modelos que se relaciona com a marca
CREATE TABLE modelo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_marca INT NOT NULL,
    FOREIGN KEY (id_marca) REFERENCES marca(id)
);

-- Criar tabela de carros que se relaciona com modelo
CREATE TABLE carro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_modelo INT NOT NULL,
    ano_fabricacao YEAR NOT NULL,
    cor VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    quilometragem INT NOT NULL,
	URL_imagem VARCHAR(255),
    status_disponibilidade ENUM('Disponível', 'Indisponível') NOT NULL,
    FOREIGN KEY (id_modelo) REFERENCES modelo(id)
);


