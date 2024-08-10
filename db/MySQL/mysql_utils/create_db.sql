-- create the main database, user, and password
CREATE DATABASE collabor8;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'adminpwd';

GRANT ALL PRIVILEGES ON collabor8.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;
