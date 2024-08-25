CREATE DATABASE IF NOT EXISTS quiz_management_db;
CREATE USER IF NOT EXISTS 'wassola'@'localhost' IDENTIFIED BY 'wassola';
GRANT ALL PRIVILEGES ON `QuizWhiz`.* TO 'wassola'@'localhost';
FLUSH PRIVILEGES;
