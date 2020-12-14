-- MariaDB dump 10.17  Distrib 10.4.14-MariaDB, for Linux (x86_64)
--
-- Host: faure    Database: cs314
-- ------------------------------------------------------
-- Server version	10.3.17-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `colorado`
--

DROP TABLE IF EXISTS `colorado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `colorado` (
  `index` int(11) NOT NULL,
  `id` varchar(30) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `latitude` varchar(1000) DEFAULT NULL,
  `longitude` varchar(1000) DEFAULT NULL,
  `altitude` varchar(1000) DEFAULT NULL,
  `continent` varchar(1000) DEFAULT NULL,
  `iso_country` varchar(1000) DEFAULT NULL,
  `iso_region` varchar(1000) DEFAULT NULL,
  `municipality` varchar(1000) DEFAULT NULL,
  `scheduled_service` varchar(1000) DEFAULT NULL,
  `gps_code` varchar(1000) DEFAULT NULL,
  `iata_code` varchar(1000) DEFAULT NULL,
  `local_code` varchar(1000) DEFAULT NULL,
  `home_link` varchar(1000) DEFAULT NULL,
  `wikipedia_link` varchar(1000) DEFAULT NULL,
  `keywords` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `airports_name_idx` (`name`),
  FULLTEXT KEY `airpots_municipality_idx` (`municipality`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colorado`
--
-- WHERE:  municipality='Denver'

LOCK TABLES `colorado` WRITE;
/*!40000 ALTER TABLE `colorado` DISABLE KEYS */;
INSERT INTO `colorado` VALUES (7121,'0CD4','heliport','Kauffman Heliport','40.1463012695','-104.887001038','5120','NA','US','US-CO','Denver','no','0CD4',NULL,'0CD4',NULL,NULL,NULL),(7704,'11CO','heliport','Channel 7 Heliport','39.72529983520508','-104.98400115966797','5300','NA','US','US-CO','Denver','no','11CO',NULL,'11CO',NULL,NULL,NULL),(9359,'2CO4','heliport','Presbyterian/St Luke\'s Medical Center Heliport','39.7494010925293','-104.96900177001953','5291','NA','US','US-CO','Denver','no','2CO4',NULL,'2CO4',NULL,NULL,NULL),(12122,'57CO','heliport','The Children\'s Hospital Heliport','39.733299255371094','-104.96700286865234','5436','NA','US','US-CO','Denver','no','57CO',NULL,'57CO',NULL,NULL,NULL),(13138,'69CO','heliport','Porter Memorial Hospital Heliport','39.670799255371094','-104.97599792480469','5349','NA','US','US-CO','Denver','no','69CO',NULL,'69CO',NULL,NULL,NULL),(15680,'9CO0','heliport','Police Headquarters Heliport','39.73749923706055','-104.99199676513672','5350','NA','US','US-CO','Denver','no','9CO0',NULL,'9CO0',NULL,NULL,NULL),(16855,'CO01','heliport','General Mail Facility Heliport','39.79050064086914','-104.9020004272461','5223','NA','US','US-CO','Denver','no','CO01',NULL,'CO01',NULL,NULL,NULL),(16858,'CO04','heliport','St Anthony Hospital Central Heliport','39.74250030517578','-105.0469970703125','5275','NA','US','US-CO','Denver','no','CO04',NULL,'CO04',NULL,NULL,NULL),(16883,'CO29','heliport','University Hospital Heliport','39.73189926147461','-104.93800354003906','5418','NA','US','US-CO','Denver','no','CO29',NULL,'CO29',NULL,NULL,NULL),(16884,'CO30','heliport','Gates Rubber County Heliport','39.698001861572266','-104.98699951171875','5289','NA','US','US-CO','Denver','no','CO30',NULL,'CO30',NULL,NULL,NULL),(16885,'CO31','heliport','Rose Medical Center Heliport','39.733299255371094','-104.94000244140625','5383','NA','US','US-CO','Denver','no','CO31',NULL,'CO31',NULL,NULL,NULL),(16886,'CO32','heliport','Capri Heliport','39.85279846191406','-104.97699737548828','5255','NA','US','US-CO','Denver','no','CO32',NULL,'CO32',NULL,NULL,NULL),(16888,'CO34','heliport','St Lukes Hospital Heliport','39.74720001220703','-104.98100280761719','5330','NA','US','US-CO','Denver','no','CO34',NULL,'CO34',NULL,NULL,NULL),(16889,'CO35','heliport','Denver Health Heliport','39.727500915527344','-104.99099731445312','5212','NA','US','US-CO','Denver','no','CO35',NULL,'CO35',NULL,NULL,NULL),(16891,'CO37','heliport','St Joseph Hospital Heliport','39.74580001831055','-104.96900177001953','5463','NA','US','US-CO','Denver','no','CO37',NULL,'CO37',NULL,NULL,NULL),(16893,'CO39','heliport','Denver Federal Center Helistop','39.72330093383789','-105.11100006103516','5550','NA','US','US-CO','Denver','no','CO39',NULL,'CO39',NULL,NULL,NULL),(16894,'CO40','heliport','Vtol Heliport','39.742801666259766','-104.99400329589844','5354','NA','US','US-CO','Denver','no','CO40',NULL,'CO40',NULL,NULL,NULL),(16895,'CO41','heliport','Denver Police Department-District 3 Heliport','39.6875','-104.95999908447266','5340','NA','US','US-CO','Denver','no','CO41',NULL,'CO41',NULL,NULL,NULL),(16941,'CO88','heliport','Kusa Helistop','39.721099853515625','-104.98300170898438','5260','NA','US','US-CO','Denver','no','CO88',NULL,'CO88',NULL,NULL,NULL),(19291,'KAPA','medium_airport','Centennial Airport','39.57009888','-104.848999','5885','NA','US','US-CO','Denver','no','KAPA','APA','APA',NULL,'http://en.wikipedia.org/wiki/Centennial_Airport','Arapahoe County Airport'),(3411,'KBJC','medium_airport','Rocky Mountain Metropolitan Airport','39.90879822','-105.1169968','5673','NA','US','US-CO','Denver','no','KBJC','BJC','BJC',NULL,'http://en.wikipedia.org/wiki/Rocky_Mountain_Metropolitan_Airport','Jefferson County Airport, Jeffco Airport'),(3486,'KDEN','large_airport','Denver International Airport','39.861698150635','-104.672996521','5431','NA','US','US-CO','Denver','yes','KDEN','DEN','DEN','http://www.flydenver.com/','http://en.wikipedia.org/wiki/Denver_International_Airport','DVX, KVDX'),(19903,'KFTG','small_airport','Front Range Airport','39.785301208496094','-104.54299926757812','5512','NA','US','US-CO','Denver','no','KFTG',NULL,'FTG',NULL,NULL,NULL),(45986,'US-0073','heliport','Dtc North Heliport','39.6349983215','-104.898002625','5585','NA','US','US-CO','Denver','no',NULL,NULL,NULL,NULL,NULL,NULL),(28113,'X-KDEN','closed','Denver Stapleton International Airport','39.774200439453125','-104.87899780273438','5333','NA','US','US-CO','Denver','no',NULL,NULL,NULL,NULL,'http://en.wikipedia.org/wiki/Stapleton_International_Airport','DEN KDEN');
/*!40000 ALTER TABLE `colorado` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-09 21:59:15
