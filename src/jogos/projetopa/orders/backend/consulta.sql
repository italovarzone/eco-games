-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 13-Maio-2023 às 14:54
-- Versão do servidor: 10.4.28-MariaDB
-- versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bdmemoria`
--

CREATE DATABASE bdmemoria;

USE bdmemoria;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(6) UNSIGNED NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `last_time` varchar(5) NOT NULL,
  `time_record` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `last_time`, `time_record`) VALUES
(1, 'Italo', 'italo@italo.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '00:26'),
(2, 'Gustavo', 'gustavo@gustavo.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '00:42'),
(3, 'João', 'joao@joao.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '00:33'),
(4, 'José', 'jose@jose.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '00:43'),
(6, 'Camilo', 'camilo@camilo.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '00:28'),
(7, 'Diego', 'diego@diego.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '00:00', '01:28'),
(8, 'Antero', 'antero@antero.com', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', '00:00', '00:31');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
