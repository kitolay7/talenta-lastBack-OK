-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: testdb
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `SEQUENCES`
--

DROP TABLE IF EXISTS `SEQUENCES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SEQUENCES` (
  `NM_SEQUENCE` varchar(32) NOT NULL,
  `VR_SEQUENCE` bigint NOT NULL,
  UNIQUE KEY `NM_SEQUENCE` (`NM_SEQUENCE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SEQUENCES`
--

LOCK TABLES `SEQUENCES` WRITE;
/*!40000 ALTER TABLE `SEQUENCES` DISABLE KEYS */;
INSERT INTO `SEQUENCES` VALUES ('postulation_sequence',2);
/*!40000 ALTER TABLE `SEQUENCES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blobs`
--

DROP TABLE IF EXISTS `blobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) DEFAULT NULL,
  `extension` varchar(255) DEFAULT NULL,
  `OffreId` int DEFAULT NULL,
  `TypeBlobId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `OffreId` (`OffreId`),
  KEY `TypeBlobId` (`TypeBlobId`),
  CONSTRAINT `blobs_ibfk_1` FOREIGN KEY (`OffreId`) REFERENCES `offres` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blobs_ibfk_2` FOREIGN KEY (`TypeBlobId`) REFERENCES `type_blobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blobs`
--

LOCK TABLES `blobs` WRITE;
/*!40000 ALTER TABLE `blobs` DISABLE KEYS */;
INSERT INTO `blobs` VALUES (1,'video-1594142247.mp4','mp4',1,2);
/*!40000 ALTER TABLE `blobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `criteria_point_questions`
--

DROP TABLE IF EXISTS `criteria_point_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criteria_point_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wording` varchar(255) DEFAULT NULL,
  `point` varchar(255) DEFAULT NULL,
  `questionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questionId` (`questionId`),
  CONSTRAINT `criteria_point_questions_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criteria_point_questions`
--

LOCK TABLES `criteria_point_questions` WRITE;
/*!40000 ALTER TABLE `criteria_point_questions` DISABLE KEYS */;
INSERT INTO `criteria_point_questions` VALUES (1,'Total','5',1),(2,'Total','5',2),(3,'Total','5',3),(4,'Total','5',4),(5,'Partiel','5',5),(6,'Compréhension écrite','1',6),(7,'Grammaire','2',6),(8,'Diction','4',6),(9,'Prononciation','1',7),(10,'Grammaire','2',7),(11,'Diction','4',7);
/*!40000 ALTER TABLE `criteria_point_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offres`
--

DROP TABLE IF EXISTS `offres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `contexte` varchar(255) DEFAULT NULL,
  `missions` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `messages` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `publier` tinyint(1) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT NULL,
  `post` varchar(255) DEFAULT NULL,
  `secteur` varchar(255) DEFAULT NULL,
  `publicationDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `offres_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offres`
--

LOCK TABLES `offres` WRITE;
/*!40000 ALTER TABLE `offres` DISABLE KEYS */;
INSERT INTO `offres` VALUES (1,'dev mobile','desc file','contexte file','construire application','BACC + 3','messages 1','Dago',1,0,'developpeur mobile',NULL,'2020-07-09 00:00:00','2020-09-02 22:33:12','2020-09-02 22:33:12',1);
/*!40000 ALTER TABLE `offres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulations`
--

DROP TABLE IF EXISTS `postulations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postulations` (
  `index` int DEFAULT NULL,
  `testDate` datetime DEFAULT NULL,
  `testPassed` int DEFAULT '0',
  `totalPoint` int DEFAULT '0',
  `admissibility` int DEFAULT '2',
  `note` int DEFAULT '0',
  `decision` varchar(255) DEFAULT 'En attente',
  `observation` varchar(255) DEFAULT NULL,
  `offreId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`offreId`,`userId`),
  UNIQUE KEY `index` (`index`),
  KEY `userId` (`userId`),
  CONSTRAINT `postulations_ibfk_1` FOREIGN KEY (`offreId`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postulations_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulations`
--

LOCK TABLES `postulations` WRITE;
/*!40000 ALTER TABLE `postulations` DISABLE KEYS */;
INSERT INTO `postulations` VALUES (1,NULL,0,0,2,0,'En attente',NULL,1,2),(2,'2020-09-02 23:34:05',2,39,2,15,'En attente','Insuffisant',1,3);
/*!40000 ALTER TABLE `postulations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `numTel` varchar(255) DEFAULT NULL,
  `metierActuel` varchar(255) DEFAULT NULL,
  `anneesExperiences` varchar(255) DEFAULT NULL,
  `niveauEtudes` varchar(255) DEFAULT NULL,
  `diplomes` varchar(255) DEFAULT NULL,
  `specialisations` varchar(255) DEFAULT NULL,
  `codePostal` varchar(255) DEFAULT NULL,
  `societe` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,'Manolotsoa','Razafindrakoto','Andrononobe','Madagascar','+261325127062','chomeur','2 ans','terminales','BACC','Serie C','Tana 101','Tilt','2020-09-02 22:32:55','2020-09-02 22:32:55',1),(2,'Abella','Rajaonarison','Ambatobe','Madagascar','+261325127065','agent d\'appel','1 ans','universitaire','M2','Commnunication','Tana 101','Meithy Call','2020-09-02 22:33:00','2020-09-02 22:33:00',2),(3,'Houssen','Be','Ambohipo','Madagascar','+261325127064','developpeur','2 ans','unversitaire','licence','developpeur','Tana 101','Your Target','2020-09-02 22:33:04','2020-09-02 22:33:04',3);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enunciate` varchar(255) DEFAULT NULL,
  `timer` varchar(255) DEFAULT NULL,
  `offreId` int DEFAULT NULL,
  `TypeQuestionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offreId` (`offreId`),
  KEY `TypeQuestionId` (`TypeQuestionId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`offreId`) REFERENCES `offres` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`TypeQuestionId`) REFERENCES `type_questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'TRUMP IS PDT','30s',1,1),(2,'TRUMP IS BAE','20s',1,1),(3,'Ennoncé multiple','20s',1,2),(4,'Ennoncé multiple 2','20s',1,2),(5,'Ennoncé hierarchique','20s',1,3),(6,'Ennocé Rédaction','1mn',1,4),(7,'Ennoncé orale','10s',1,5);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzs`
--

DROP TABLE IF EXISTS `quizzs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `fiche_dir` varchar(255) DEFAULT NULL,
  `author_dir` varchar(255) DEFAULT NULL,
  `offreId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offreId` (`offreId`),
  KEY `userId` (`userId`),
  CONSTRAINT `quizzs_ibfk_1` FOREIGN KEY (`offreId`) REFERENCES `offres` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quizzs_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzs`
--

LOCK TABLES `quizzs` WRITE;
/*!40000 ALTER TABLE `quizzs` DISABLE KEYS */;
INSERT INTO `quizzs` VALUES (1,'Manou','Coller le texte de la fiche de poste :','Coller le texte de la fiche de poste :',1,NULL);
/*!40000 ALTER TABLE `quizzs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reponses`
--

DROP TABLE IF EXISTS `reponses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reponses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `choices` varchar(255) DEFAULT NULL,
  `isAnswers` tinyint(1) DEFAULT NULL,
  `type_audio` int DEFAULT NULL,
  `rang` int DEFAULT NULL,
  `questionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questionId` (`questionId`),
  CONSTRAINT `reponses_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reponses`
--

LOCK TABLES `reponses` WRITE;
/*!40000 ALTER TABLE `reponses` DISABLE KEYS */;
INSERT INTO `reponses` VALUES (1,NULL,1,NULL,NULL,1),(2,NULL,0,NULL,NULL,2),(3,'<10',1,NULL,NULL,3),(4,'=10',0,NULL,NULL,3),(5,'<1',1,NULL,NULL,3),(6,'diso',0,NULL,NULL,3),(7,'1',1,NULL,NULL,4),(8,'2',0,NULL,NULL,4),(9,'3',0,NULL,NULL,4),(10,'4',0,NULL,NULL,4),(11,'1+1 =2',NULL,NULL,0,5),(12,'1+1+1=3',NULL,NULL,1,5),(13,'1+1+1+1=4',NULL,NULL,2,5),(14,'1+1+1+1+1=5',NULL,NULL,3,5),(15,'Réponse texte',NULL,NULL,NULL,6),(16,NULL,NULL,1,NULL,7);
/*!40000 ALTER TABLE `reponses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'candidat'),(3,'recruteur');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_blobs`
--

DROP TABLE IF EXISTS `type_blobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_blobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wording` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wording` (`wording`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_blobs`
--

LOCK TABLES `type_blobs` WRITE;
/*!40000 ALTER TABLE `type_blobs` DISABLE KEYS */;
INSERT INTO `type_blobs` VALUES (4,'diaporama'),(1,'logo'),(3,'photo_animés'),(2,'video');
/*!40000 ALTER TABLE `type_blobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_questions`
--

DROP TABLE IF EXISTS `type_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wording` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_questions`
--

LOCK TABLES `type_questions` WRITE;
/*!40000 ALTER TABLE `type_questions` DISABLE KEYS */;
INSERT INTO `type_questions` VALUES (1,'Vrai ou Faux'),(2,'Choix multiple'),(3,'Classement hiérarchique'),(4,'Rédaction'),(5,'Audio'),(6,'Video');
/*!40000 ALTER TABLE `type_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('2020-09-02 22:32:55','2020-09-02 22:32:55',1,1),('2020-09-02 22:32:55','2020-09-02 22:32:55',2,1),('2020-09-02 22:33:00','2020-09-02 22:33:00',2,2),('2020-09-02 22:33:04','2020-09-02 22:33:04',2,3),('2020-09-02 22:32:55','2020-09-02 22:32:55',3,1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'manolotsoo','manolotsoadaniel@gmail.com','$2a$08$gshYq0UZnvDsZTE4q7ym2uXBwKnVu.UhIc4b0I/T7BteE9rouD2KK','2020-09-02 22:32:55','2020-09-02 22:32:55'),(2,'abella','abellaraj@gmail.com','$2a$08$MARez5hYZJl9RF7kHz92TOn17tR0q9x/DJ1eexYQdEL5amIbU2so.','2020-09-02 22:33:00','2020-09-02 22:33:00'),(3,'anjara','beanjara@gmail.com','$2a$08$ZIvvz9UGfDDRS2EvYmwYeePAi1SogIRCKtZLPfuuOxaVxKCGZAfoe','2020-09-02 22:33:04','2020-09-02 22:33:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-03  5:57:32
