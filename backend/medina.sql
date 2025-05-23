-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: medina
-- ------------------------------------------------------
-- Server version	9.2.0-commercial

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `annotations`
--

DROP TABLE IF EXISTS `annotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `oeuvre_id` int NOT NULL,
  `utilisateur_id` int NOT NULL,
  `texte` text NOT NULL,
  `section` varchar(255) NOT NULL,
  `position_x` float DEFAULT '0',
  `position_y` float DEFAULT '0',
  `largeur` float DEFAULT '100',
  `hauteur` float DEFAULT '50',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `oeuvre_id` (`oeuvre_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `annotations_ibfk_1` FOREIGN KEY (`oeuvre_id`) REFERENCES `oeuvre` (`id`) ON DELETE CASCADE,
  CONSTRAINT `annotations_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaires` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `oeuvre_id` int NOT NULL,
  `contenu` text NOT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `selection` text,
  `section` varchar(50) DEFAULT NULL,
  `position_start` int DEFAULT NULL,
  `position_end` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `oeuvre_id` (`oeuvre_id`),
  CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE CASCADE,
  CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`oeuvre_id`) REFERENCES `oeuvre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fiches`
--

DROP TABLE IF EXISTS `fiches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fiches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `fichier_pdf` varchar(255) NOT NULL,
  `date_soumission` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `fk_fiches_utilisateurs` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medias`
--

DROP TABLE IF EXISTS `medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `types_medias` enum('image','video','lien') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `chemin_media` varchar(255) NOT NULL,
  `taille` int DEFAULT NULL,
  `date_ajout` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_utilisateur` int DEFAULT NULL,
  `id_section` enum('architecture','archeologie','histoire','ressources') DEFAULT NULL,
  `id_oeuvre` int DEFAULT NULL,
  `chemin_thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `medias_ibfk_2` (`id_section`),
  KEY `fk_oeuvre` (`id_oeuvre`),
  CONSTRAINT `fk_oeuvre` FOREIGN KEY (`id_oeuvre`) REFERENCES `oeuvre` (`id`),
  CONSTRAINT `medias_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`utilisateur_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `message` text NOT NULL,
  `type` enum('partage','modif','nouveau utilisateur','acceptation','refus','invitation') DEFAULT NULL,
  `lu` tinyint(1) DEFAULT '0',
  `statut` enum('en_attente','accepte','refuse') DEFAULT 'en_attente',
  `contenu_original` text,
  `contenu_nouveau` text,
  `reference_id` int DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `heure_de_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `emetteur_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oeuvre`
--

DROP TABLE IF EXISTS `oeuvre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oeuvre` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text,
  `date_creation` date DEFAULT NULL,
  `id_createur` int DEFAULT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `wilaya` enum('Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','B├®ja├»a','Biskra','B├®char','Blida','Bouira','Tamanrasset','T├®bessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','S├®tif','Sa├»da','Skikda','Sidi Bel Abb├¿s','Annaba','Guelma','Constantine','M├®d├®a','Mostaganem','M?Sila','Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arr├®ridj','Boumerd├¿s','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','A├»n Defla','Na├óma','A├»n T├®mouchent','Gharda├»a','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','B├®ni Abb├¿s','In Salah','In Guezzam','Touggourt','Djanet','El M?Ghair','El Menia') NOT NULL,
  `date_modif` date DEFAULT NULL,
  `date_pub` date DEFAULT NULL,
  `statut` enum('brouillon','publie') NOT NULL DEFAULT 'brouillon',
  `photo` varchar(255) DEFAULT NULL,
  `periode` year DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_createur` (`id_createur`),
  CONSTRAINT `oeuvre_ibfk_1` FOREIGN KEY (`id_createur`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `titre` enum('architecture','archeologie','histoire','resources') DEFAULT NULL,
  `contenu_text` text,
  `contenu_html` text,
  `contenu_text_old` text,
  `contenu_html_old` text,
  `id_oeuvre` int NOT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `table_metadata` text,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `id_oeuvre` (`id_oeuvre`),
  CONSTRAINT `section_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`),
  CONSTRAINT `section_ibfk_2` FOREIGN KEY (`id_oeuvre`) REFERENCES `oeuvre` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `utilisateur_projet`
--

DROP TABLE IF EXISTS `utilisateur_projet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_projet` (
  `id_utilisateur` int NOT NULL,
  `id_projet` int NOT NULL,
  `role` enum('createur','contributeur') NOT NULL,
  `date_participation` datetime DEFAULT CURRENT_TIMESTAMP,
  KEY `utilisateur_id` (`id_utilisateur`),
  KEY `id_projet` (`id_projet`),
  CONSTRAINT `utilisateur_projet_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`utilisateur_id`) ON DELETE CASCADE,
  CONSTRAINT `utilisateur_projet_ibfk_2` FOREIGN KEY (`id_projet`) REFERENCES `oeuvre` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `utilisateur_id` int NOT NULL AUTO_INCREMENT,
  `genre` enum('Homme','Femme') NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `date_inscription` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('visiteur','professionnel','admin') NOT NULL,
  `statut` enum('en attente','valide','rejete') DEFAULT 'en attente',
  `specialite` enum('architecte','historien','archeologue') DEFAULT NULL,
  `niveau_expertise` enum('specialiste','expert') NOT NULL DEFAULT 'specialiste',
  `numero_ordre` varchar(50) DEFAULT NULL,
  `etablissement_origine` varchar(255) DEFAULT NULL,
  `nom_agence` varchar(100) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`utilisateur_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13 23:32:24
