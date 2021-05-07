-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql.metropolia.fi
-- Generation Time: 07.05.2021 klo 11:31
-- Palvelimen versio: 10.1.48-MariaDB
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `juusoalk`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_hashtags`
--

CREATE TABLE `ms_hashtags` (
  `tagId` int(11) NOT NULL,
  `tag` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_ingredient_object`
--

CREATE TABLE `ms_ingredient_object` (
  `ingredientId` int(11) NOT NULL,
  `ingredient` varchar(40) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_likes`
--

CREATE TABLE `ms_likes` (
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vst` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_post`
--

CREATE TABLE `ms_post` (
  `postId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `file` text,
  `caption` text,
  `vst` date NOT NULL,
  `vet` date DEFAULT NULL,
  `privacy` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_postcomment`
--

CREATE TABLE `ms_postcomment` (
  `commentId` int(11) NOT NULL,
  `postId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `comment` text,
  `vst` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_post_ingredients`
--

CREATE TABLE `ms_post_ingredients` (
  `ingredientId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `unit` text,
  `amount` int(11) DEFAULT NULL,
  `addOrder` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_settings`
--

CREATE TABLE `ms_settings` (
  `userId` int(11) DEFAULT NULL,
  `privacy` tinyint(1) DEFAULT NULL,
  `notifications` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_tag_post_relations`
--

CREATE TABLE `ms_tag_post_relations` (
  `postId` int(11) DEFAULT NULL,
  `tagId` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_user`
--

CREATE TABLE `ms_user` (
  `userId` int(11) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` text,
  `email` varchar(30) DEFAULT NULL,
  `fname` text,
  `lname` text,
  `avatar` text,
  `bio` text,
  `admin` tinyint(1) DEFAULT NULL,
  `vst` date NOT NULL,
  `vet` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Rakenne taululle `ms_workphases`
--

CREATE TABLE `ms_workphases` (
  `postId` int(11) DEFAULT NULL,
  `phases` text
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ms_hashtags`
--
ALTER TABLE `ms_hashtags`
  ADD PRIMARY KEY (`tagId`);

--
-- Indexes for table `ms_ingredient_object`
--
ALTER TABLE `ms_ingredient_object`
  ADD PRIMARY KEY (`ingredientId`),
  ADD UNIQUE KEY `ingredient` (`ingredient`);

--
-- Indexes for table `ms_likes`
--
ALTER TABLE `ms_likes`
  ADD PRIMARY KEY (`postId`,`userId`);

--
-- Indexes for table `ms_post`
--
ALTER TABLE `ms_post`
  ADD PRIMARY KEY (`postId`,`vst`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `ms_postcomment`
--
ALTER TABLE `ms_postcomment`
  ADD PRIMARY KEY (`commentId`,`vst`),
  ADD KEY `postId` (`postId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `ms_post_ingredients`
--
ALTER TABLE `ms_post_ingredients`
  ADD PRIMARY KEY (`addOrder`),
  ADD KEY `postId` (`postId`),
  ADD KEY `ingredientId` (`ingredientId`);

--
-- Indexes for table `ms_settings`
--
ALTER TABLE `ms_settings`
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `ms_tag_post_relations`
--
ALTER TABLE `ms_tag_post_relations`
  ADD KEY `postId` (`postId`),
  ADD KEY `tagId` (`tagId`);

--
-- Indexes for table `ms_user`
--
ALTER TABLE `ms_user`
  ADD PRIMARY KEY (`userId`,`vst`),
  ADD UNIQUE KEY `username` (`username`,`email`),
  ADD UNIQUE KEY `username_2` (`username`,`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ms_workphases`
--
ALTER TABLE `ms_workphases`
  ADD UNIQUE KEY `postId` (`postId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ms_hashtags`
--
ALTER TABLE `ms_hashtags`
  MODIFY `tagId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ms_ingredient_object`
--
ALTER TABLE `ms_ingredient_object`
  MODIFY `ingredientId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ms_post`
--
ALTER TABLE `ms_post`
  MODIFY `postId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ms_postcomment`
--
ALTER TABLE `ms_postcomment`
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ms_post_ingredients`
--
ALTER TABLE `ms_post_ingredients`
  MODIFY `addOrder` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ms_user`
--
ALTER TABLE `ms_user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
