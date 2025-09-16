-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2024 at 07:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `booklist`
--

CREATE TABLE `booklist` (
  `book_id` varchar(10) NOT NULL,
  `name` varchar(60) NOT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL COMMENT '1= Available\r\n2=pending\r\n3=borrowing\r\n4=diable',
  `type` int(2) UNSIGNED NOT NULL COMMENT '1=Finance\r\n2=English\r\n3=Engineering\r\n4=Science\r\n5=Marketing',
  `print` date NOT NULL,
  `publisher` varchar(30) NOT NULL,
  `img` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `booklist`
--

INSERT INTO `booklist` (`book_id`, `name`, `status`, `type`, `print`, `publisher`, `img`) VALUES
('1983465720', 'Listening with Speaking, Level 3', 1, 2, '2019-01-24', 'Jill Korey O\'Sullivan', 'book4.jpg'),
('3258076491', 'SAME AS EVER', 1, 1, '2023-11-07', 'Morgan Housel', 'book2.jpg'),
('3746958201', 'Marketing 4.0', 1, 5, '2016-12-05', 'Philip Kotler', 'book9.jpg'),
('4102938576', 'Code Complete', 1, 3, '2014-07-07', 'Steve McConnell', 'book5.jpg'),
('5082719463', 'The Disappearing Spoon', 1, 4, '2011-06-06', 'Sam Kean', 'book8.jpg'),
('5678091234', 'The Pragmatic Programme', 1, 3, '2019-12-21', 'Andrew Hunt and David Thomas', 'book6.jpg'),
('6193847025', 'SEO 100', 1, 5, '2017-01-15', 'Joe Anucha', 'book10.jpg'),
('7261594830', 'American Accent Training', 1, 2, '1991-02-15', 'Ann Cook', 'book3.jpg'),
('7365920481', 'Hidden Potential', 1, 4, '2023-10-24', 'Adam Grant', 'book7.jpg'),
('8745932016', 'THE RICHEST MAN IN BABYLON', 1, 1, '2007-03-29', 'George s.Clason', 'book1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `no` int(10) UNSIGNED NOT NULL,
  `book_id` varchar(10) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  `returned_date` date NOT NULL,
  `borrowing_date` date NOT NULL,
  `lecturer_id` varchar(10) DEFAULT NULL,
  `status` tinyint(1) NOT NULL COMMENT '1st Cycle\r\n1=waiting\r\n4=disapproved\r\n2nd Cycle\r\n1=waiting\r\n2=borrowing\r\n3=returned',
  `staff_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `typebook`
--

CREATE TABLE `typebook` (
  `no` int(2) UNSIGNED NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `typebook`
--

INSERT INTO `typebook` (`no`, `type`) VALUES
(1, 'Finance'),
(2, 'English'),
(3, 'Engineering'),
(4, 'Science'),
(5, 'Marketing');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(10) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `fullname` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `role` tinyint(1) UNSIGNED NOT NULL COMMENT '1=staff\r\n2=lecturer\r\n3=student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `email`, `role`) VALUES
('1000112345', 'Matthew.www', '$2b$10$8GZq9rP8Np5Ri2M2lrtYmOYotrvzb6dVaaTCUP/oBQijNLbzT21ma', 'Mr. Matthew Collins', '1000112345@lamduan.mfu.ac.th', 1),
('1000123456', 'Emily_lovemom', '$2b$10$Ot5Cr31oAM5VZ2kWbKzLkODgZn6g2hEuxy3krVNzHMuFUQyTl83eS', 'Miss Emily Johnson', '1000123456@lamduan.mfu.ac.th', 1),
('2222056789', 'Olivia_cutetycat', '$2b$10$5jXq7Ft3cKTtv/m.UF/lXeASXp3NwDwi5O2SJ.BnA.0WvIbuCkJ/q', 'Olivia Smith', '2222056789@lamduan.mfu.ac.th', 2),
('2222078910', 'Daniel.loveduggy', '$2b$10$eC3UPjEiq49IobH7yYceQunInfslP3oBZWh.wDQrd7NdGLxaBOY8e', 'Daniel Lee', '2222078910@lamduan.mfu.ac.th', 2),
('6931501234', 'James_An', '$2b$10$by0x.Tp0d.HQwKqngnCSwe/kBrLaDDZzM8/f8J0/6MOuiqofNRjjq', 'Mr. James Anderson', '6931501234@lamduan.mfu.ac.th', 3),
('6931505678', 'Emmazaza', '$2b$10$.m8JsyfzSFaOPb7UGuLhA.aMud1oF.2kWacLkVNwDXI/g0kO3QfJ2', 'Ms. Emma Johnson', '6931505678@lamduan.mfu.ac.th', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booklist`
--
ALTER TABLE `booklist`
  ADD PRIMARY KEY (`book_id`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`no`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `lecturer_id` (`lecturer_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `typebook`
--
ALTER TABLE `typebook`
  ADD PRIMARY KEY (`no`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `no` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typebook`
--
ALTER TABLE `typebook`
  MODIFY `no` int(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booklist`
--
ALTER TABLE `booklist`
  ADD CONSTRAINT `booklist_ibfk_1` FOREIGN KEY (`type`) REFERENCES `typebook` (`no`);

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `request_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `request_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `request_ibfk_4` FOREIGN KEY (`book_id`) REFERENCES `booklist` (`book_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
