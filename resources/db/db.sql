-- Active: 1679243233366@@127.0.0.1@3306@scoutlog

DROP DATABASE IF EXISTS `scoutchat`;

CREATE DATABASE `scoutchat`;

USE `scoutchat`;
DROP TABLE IF EXISTS `msg`;
CREATE TABLE
    `msg`(
        `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `author` VARCHAR(255) NOT NULL,
        `text` VARCHAR(255) NOT NULL,
        `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    `user`(
        `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(255) NOT NULL,
        `img` BLOB NOT NULL,
        `background` BLOB NOT NULL
    );

CREATE TABLE
    `chat`(
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `icon` BLOB NOT NULL
    );

CREATE TABLE
    `friend`(
        `userId` INT NOT NULL,
        `friendId` INT NOT NULL,
        `alias` VARCHAR(255),
        `chatId` INT
    );

CREATE TABLE
    `join`(
        `userId` INT NOT NULL,
        `chatId` INT NOT NULL,
        `admin` BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
        FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`),
        PRIMARY KEY (`userId`, `chatId`)
    );

SELECT * FROM msg;
INSERT INTO `msg`(`author`, `text`) VALUES('WILLY', 'xd');