-- CREATE the main DATABASE, USER, AND password
DROP DATABASE IF EXISTS collabor8;

CREATE DATABASE IF NOT EXISTS collabor8;

CREATE USER IF NOT EXISTS 'collabor'@'localhost' IDENTIFIED BY 'collabor8';

GRANT ALL PRIVILEGES ON collabor8.* TO 'collabor'@'localhost';

FLUSH PRIVILEGES;
