<?php

include '../orders/backend/conexao.php';

$connect = new mysqli("localhost", "root", "", "bdmemoria");

if ($connect->connect_errno) {
    echo "Failed to connect to MySQL: " . $connect->connect_error;
    exit();
}

session_start();

$user = $_SESSION['usuario_id'];

$sql = "SELECT time_record FROM usuarios WHERE id = '$user'";

$result = mysqli_query($connect, $sql);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    $response = array('time_record' => $row['time_record'] ?? null);
    echo json_encode($response);
} else {
    echo json_encode(array());
}

mysqli_close($connect);

?>