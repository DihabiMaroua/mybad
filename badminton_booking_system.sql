-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 29 déc. 2023 à 19:16
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `badminton_booking_system`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
CREATE TABLE IF NOT EXISTS `administrators` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_username` varchar(30) COLLATE utf8_bin NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_username` (`admin_username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `administrators`
--

INSERT INTO `administrators` (`admin_id`, `admin_username`, `password_hash`) VALUES
(1, 'admybad', '1dcf7e79706ae3fddced9dd2b8656af7ffa94f1a377c2c6ebc58ac8373d02820');

-- --------------------------------------------------------

--
-- Structure de la table `courts`
--

DROP TABLE IF EXISTS `courts`;
CREATE TABLE IF NOT EXISTS `courts` (
  `court_id` char(1) COLLATE utf8_bin NOT NULL,
  `status` enum('unavailable','available') COLLATE utf8_bin NOT NULL DEFAULT 'available',
  PRIMARY KEY (`court_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `courts`
--

INSERT INTO `courts` (`court_id`, `status`) VALUES
('A', 'unavailable'),
('B', 'unavailable'),
('C', 'available'),
('D', 'available');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `court_id` char(1) COLLATE utf8_bin DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'confirmed',
  PRIMARY KEY (`reservation_id`),
  KEY `resrvations_courts` (`court_id`),
  KEY `reservations_users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `user_id`, `court_id`, `reservation_date`, `start_time`, `end_time`, `status`) VALUES
(1, 1, 'A', '2023-12-25', '10:00:00', '00:00:00', 'confirmed'),
(3, 1, 'C', '2023-12-29', '13:30:00', '00:00:00', 'confirmed'),
(4, 1, 'D', '2023-12-29', '13:30:00', '00:00:00', 'confirmed'),
(6, 1, 'A', '2023-12-29', '10:00:00', '00:00:00', 'confirmed'),
(7, 1, 'A', '2023-12-29', '12:00:00', '00:00:00', 'confirmed'),
(8, 1, 'A', '2023-12-30', '13:00:00', '00:00:00', 'confirmed'),
(9, 1, 'A', '2023-12-30', '13:00:00', '00:00:00', 'confirmed'),
(10, 1, 'A', '2023-12-23', '15:00:00', '00:00:00', 'confirmed'),
(11, 1, 'A', '2024-01-04', '18:00:00', '00:00:00', 'confirmed'),
(12, 1, 'A', '2024-01-04', '18:00:00', '00:00:00', 'confirmed'),
(13, 14, 'A', '2024-01-07', '11:49:00', '00:00:00', 'confirmed'),
(14, 14, 'A', '2024-01-01', '14:53:00', '00:00:00', 'confirmed'),
(15, 14, 'D', '2024-01-10', '14:00:00', '00:00:00', 'confirmed'),
(16, 1, 'A', '2023-12-28', '11:00:00', '11:45:00', 'confirmed'),
(17, 1, 'A', '2023-12-28', '11:46:00', '12:31:00', 'confirmed'),
(18, 1, 'D', '2023-12-28', '11:46:00', '12:31:00', 'confirmed'),
(19, 1, 'A', '2023-12-28', '10:00:00', '10:45:00', 'confirmed'),
(20, 1, 'A', '2023-12-28', '13:00:00', '13:45:00', 'confirmed'),
(21, 1, 'A', '2023-12-30', '12:18:00', '13:03:00', 'confirmed'),
(22, 1, 'A', '2023-12-30', '14:20:00', '15:05:00', 'confirmed'),
(23, 1, 'A', '2023-12-29', '19:10:00', '19:55:00', 'confirmed'),
(24, 1, 'A', '2023-12-29', '21:30:00', '22:15:00', 'confirmed'),
(25, 1, 'C', '2023-12-29', '21:15:00', '22:00:00', 'confirmed');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `username`) VALUES
(7, '1'),
(23, 'Nouha'),
(22, 'Nouha1'),
(21, 'Nouveau'),
(19, 'User'),
(1, 'UserTest'),
(16, 'tata'),
(12, 'kim'),
(6, 'pseudo'),
(4, 'maru'),
(20, 'me'),
(8, 'me1'),
(3, 'med'),
(9, 'med2'),
(17, 'ololo'),
(18, 'olololil'),
(10, 'test2'),
(11, 'testtest'),
(14, 'titi'),
(13, 'toto'),
(15, 'tutu'),
(2, 'user1'),
(5, 'user2');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `resrvations_courts` FOREIGN KEY (`court_id`) REFERENCES `courts` (`court_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
