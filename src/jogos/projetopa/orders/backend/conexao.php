<?php
// Define as variáveis de conexão com o banco de dados
$hostname = "localhost";
$username = "root";
$password = "";
$database = "bdmemoria";

// Conecta com o banco de dados
$conn = mysqli_connect($hostname, $username, $password, $database);

// Verifica se a conexão foi bem sucedida
if (!$conn) {
	die("Falha na conexão com o banco de dados: " . mysqli_connect_error());
}
?>