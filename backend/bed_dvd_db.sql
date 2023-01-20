-- @block
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar VARCHAR(255),
    role ENUM ('user', 'admin') DEFAULT 'user'
) - -