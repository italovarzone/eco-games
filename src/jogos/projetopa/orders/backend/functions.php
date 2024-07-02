<?php

function bodylogin($title)
{

    echo "<!DOCTYPE html>
    <html lang=\"pt-br\">
    <head>
        <meta charset=\"UTF-8\">
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>$title</title>
        <link rel=\"stylesheet\" href=\"../css/style.css\">
        <script src=\"js/script.js\"></script>
    </head>
    <body>
        <div class=\"container\">
            <h1>Login</h1>
            <form action=\"processa_dados_login.php\" method=\"post\">
                <label for=\"email\">E-mail:</label>
                <input type=\"email\" name=\"email\" required><br><br>
                <label for=\"senha\">Senha:</label>
                <input type=\"password\" name=\"senha\" required><br><br>
                <input type=\"button\" value=\"Voltar\" class=\"btn\" onclick=\"location.href='../../index.php'\">
                <input type=\"submit\" value=\"Entrar\" class=\"btn\">
            </form>
        </div>
    </body>
    </html>";
}

function bodycad($title)
{
    echo "<!DOCTYPE html>
    <html lang=\"pt-br\">
    <head>
        <meta charset=\"UTF-8\">
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>$title</title>
        <link rel=\"stylesheet\" href=\"../css/style.css\">
        <script src=\"js/script.js\"></script>
    </head>
    <body>
        <div class=\"container\">
            <h1>Cadastro</h1>
            <form action=\"processa_dados_cadastro.php\" method=\"post\" onsubmit=\"return validarFormulario()\">
                <label for=\"nome\">Nome:</label>
                <input type=\"text\" name=\"nome\" required><br><br>
                <label for=\"email\">E-mail:</label>
                <input type=\"email\" name=\"email\" required><br><br>
                <label for=\"senha\">Senha:</label>
                <input type=\"password\" name=\"senha\" id=\"senha\" required><br><br>
                <label for=\"confirma-senha\">Confirme a senha:</label>
                <input type=\"password\" name=\"confirma-senha\" id=\"confirma-senha\" required><br><br>
                <input type=\"button\" value=\"Voltar\" class=\"btn\" onclick=\"location.href='../../index.php'\">
                <input type=\"submit\" value=\"Cadastrar\" class=\"btn\">
            </form>
        </div>
    </body>
    </html>";
}

function logout_page()
{
    echo "<form action=\"processa_logout.php\" method=\"post\">
    <input type=\"submit\" value=\"Logout\">
    </form>";
}

?>