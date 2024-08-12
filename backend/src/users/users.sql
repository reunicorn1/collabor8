-- create the main database, user, and password
CREATE DATABASE collabor8;

CREATE USER 'collabor'@'localhost' IDENTIFIED BY 'collabor8';

GRANT ALL PRIVILEGES ON collabor8.* TO 'collabor'@'localhost';

FLUSH PRIVILEGES;
