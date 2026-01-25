CREATE DATABASE IF NOT EXISTS shopdb;

USE shopdb;

CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Product (name, price, description, image_url) VALUES
('Laptop', 999.99, 'High performance laptop', 'https://via.placeholder.com/150'),
('Phone', 499.99, 'Smartphone with good camera', 'https://via.placeholder.com/150'),
('Headphones', 99.99, 'Noise cancelling headphones', 'https://via.placeholder.com/150');
