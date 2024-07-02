<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bdmemoria";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM usuarios";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $dados = array();
  while ($row = $result->fetch_assoc()) {
    $dados[] = $row;
  }
  header('Content-Type: application/json');
  echo json_encode($dados);
} else {
  echo "Nenhum resultado encontrado";
}


?>