<?php

include 'conexao.php';

$email = $_POST['email'];
$senha = $_POST['senha'];

// Verifica se o usuário existe no banco de dados
$sql = "SELECT * FROM usuarios WHERE email = '$email' AND senha = sha1('$senha')";
$resultado = $conn->query($sql);

if ($resultado->num_rows == 1) {
    // O usuário existe e a senha está correta, então inicie uma sessão para o usuário
    session_start();
    $usuario = $resultado->fetch_assoc();
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];



    header("Location: ../../assets/php/game.php?ID=" . $usuario['id']); // Redireciona o usuário para a página "home.php"
    exit;
} else {
    echo '<script>alert("E-mail ou senha inválidos."); window.location.href="login.php";</script>';
    exit;
}

?>