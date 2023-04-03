-- Active: 1680261948714@@212.107.17.205@3306
CREATE TABLE `msg`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `author` VARCHAR(255) NOT NULL,
    `text` VARCHAR(255) NOT NULL
);        

INSERT INTO `msg`(`author`,`text`) VALUES('prueba', 'hola puta');

SELECT author, text FROM msg WHERE id > 0 AND NOT author = 'hectorrdez';
SELECT * FROM msg;