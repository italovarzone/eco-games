<?php

function homeGame($title, $username, $user)
{
  echo "<!DOCTYPE html>
    <html lang=\"pt-br\">
      <head>
        <meta charset=\"UTF-8\" />
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
        <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />
        <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />
    
        <link
          href=\"https://fonts.googleapis.com/css2?family=Righteous&display=swap\"
          rel=\"stylesheet\"
        />
    
        <link rel=\"stylesheet\" href=\"../css/login.css\"/>
        <link rel=\"stylesheet\" href=\"../css/style.css\"/>
    
        <title>$title</title>
      </head>
    
      <body>
        <div id=\"gameStart\">
          <div class=\"mensagem\">
            <p>Seja bem-vindo, $username</p>
            <button class=\"start\" id=\"startjogo\" onclick=\"startGame($user)\">
              Jogar
            </button>
            <button class=\"start\" onclick=\"location.href='../../assets/php/score.php'\">Score</button>
            <button class=\"startSair\" onclick=\"location.href='../../orders/backend/processa_logout.php'\">Sair</button>
          </div>
        </div>
    
        <div class=\"game-container\">

        <div id=\"blur-overlay\"></div>
        <div id=\"help-dialog\">
          <p>Bem-vindo ao EcoPuzzle!</p>
          <p>O ITALO É UM PANACA.</p>
          <button id=\"close-help\" onclick=\"closeHelp()\">Fechar</button>
        </div>

        <div class=\"container-button-help\">
          <button id=\"help-button\" onclick=\"showHelp()\">Como jogar?</button>
        </div>
    

        <div id=\"gameBoard\"></div>
    
        <div class=\"record-container\">
          <div class=\"tempo\">
            <div>Time: </div>
              <div id=\"time\">00:00</div>
            </div>
            <p>Record: </p>
              <div id=\"recorde\">00:00</div>
          </div>
        </div>

    
        <div id=\"gameOver\">
          <div class=\"mensagem\">
            <p id=\"resultado\"></p>
            <button class=\"btn btn-primary\" onclick=\"location.href='../php/game.php'\">Menu</button>
          </div> 
        </div>
    
        <!-- Sons do jogo !-->
        <audio
          src=\"../sound/card-start.mp3\"
          preload=\"auto\"
          id=\"card-start\"
        ></audio>
        <audio
          src=\"../sound/card-click.mp3\"
          preload=\"auto\"
          id=\"card-click\"
        ></audio>
        <audio
          src=\"../sound/card-check.mp3\"
          preload=\"auto\"
          id=\"card-check\"
        ></audio>
        <audio
          src=\"../sound/card-win.mp3\"
          preload=\"auto\"
          id=\"card-win\"
        ></audio>
    
        <!-- JavaScript !-->
        <script src=\"../js/game.js\"></script>
        <script src=\"../js/script.js\"></script>
      </body>
    </html>
    ";
}

function HomePage($title)
{
  echo "<!DOCTYPE html>
  <html lang=\"pt-br\">
  <head>
      <meta charset=\"UTF-8\">
      <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
      <title>$title</title>
      <link rel=\"stylesheet\" href=\"../projetopa/assets/css/stylehomepage.css\">

  </head>
  <body>
      <div class=\"container\">
        <div class=\"card\">
          <h2>$title</h2>
          <p>Aprenda a coleta seletiva se divertindo!</p>
          <div class=\"video-container\">
            <video src=\"../projetopa/assets/gif/game.mp4\" autoplay loop muted style=\"width: 110%;\"></video>
          </div>
          <div class=\"btn-group\" role=\"group\" aria-label=\"Opções de login e cadastro\">
              <button class=\"btn btn-primary\" onclick=\"location.href='../projetopa/orders/backend/login.php'\">Login</button>
              <button class=\"btn btn-primary\" onclick=\"location.href='../projetopa/orders/backend/cadastro.php'\">Cadastro</button>
              <button class=\"btn btn-primary\" onclick=\"location.href='../projetopa/assets/php/score.php'\">Score</button>   
          </div>
      </div>
  <!-- Bootstrap JS -->
  <script src=\"https://code.jquery.com/jquery-3.3.1.slim.min.js\"
      integrity=\"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo\"
      crossorigin=\"anonymous\"></script>
  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\"
      integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\"
      crossorigin=\"anonymous\"></script>
  <script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\"
      integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\"
      crossorigin=\"anonymous\"></script>
  </body>
  </html>";
}

?>