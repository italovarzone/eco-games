<?php

include 'conexao.php';

$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = $_POST['senha'];
$confirmaSenha = $_POST["confirma-senha"];

if ($senha !== $confirmaSenha) {
    echo '<script>alert("Erro, senhas divergentes."); window.location.href="cadastro.php";</script>';
    exit;
} else {
    // verificar se o usuário já existe no banco de dados
    $sql = "SELECT * FROM usuarios WHERE nome = '$nome' OR email = '$email'";
    $resultado = $conn->query($sql);

    if ($resultado->num_rows > 0) {
        $camposDuplicados = "";
        if ($resultado->num_rows == 1) {
            $row = $resultado->fetch_assoc();
            if ($row['nome'] == $nome) {
                $camposDuplicados = "nome";
            } else {
                $camposDuplicados = "email";
            }
        } else {
            $camposDuplicados = "nome e email";
        }
        echo '<script>alert("Erro, ' . $camposDuplicados . ' já cadastrado."); window.location.href="cadastro.php";</script>';
        exit;
    } else {
        // o usuário não existe no banco de dados
        $senha = sha1($senha);
        $sql = "INSERT INTO usuarios (nome, email, senha, last_time, time_record) VALUES ('$nome', '$email', '$senha', '00:00', '00:00')";

        if (mysqli_query($conn, $sql)) {
            header("Location: login.php");
            exit;
        } else {
            echo '<script>alert("Erro, usuário não cadastrado."); window.location.href="cadastro.php";</script>';
        }

        mysqli_close($conn);
    }
}


?>