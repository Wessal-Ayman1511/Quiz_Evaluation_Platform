CREATE DATABASE IF NOT EXISTS QuizWhiz;
CREATE USER 'wassola'@'localhost' IDENTIFIED BY 'wassola';
GRANT ALL PRIVILEGES ON `QuizWhiz`.* TO 'wassola'@'localhost';
FLUSH PRIVILEGES;
