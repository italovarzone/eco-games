<?php

include '../orders/backend/conexao.php';

$connect = new mysqli("localhost", "root", "", "bdmemoria");

if ($connect->connect_errno) {
    echo "Failed to connect to MySQL: " . $connect->connect_error;
    exit();
}

session_start();

$user = $_SESSION['usuario_id'];

// Recebe o novo recorde do usuário enviado pela requisição HTTP
$data = json_decode(file_get_contents('php://input'), true);
$time_record = $data['record'];

// Executar a query SQL para atualizar o recorde do usuário
$sql = "UPDATE usuarios SET time_record = '$time_record' WHERE id = '$user'";

if (mysqli_query($connect, $sql)) {
    echo json_encode(array("time_record" => $time_record));
} else {
    echo "Erro ao consultar na base: " . mysqli_error($connect);
}

mysqli_close($connect);
?>