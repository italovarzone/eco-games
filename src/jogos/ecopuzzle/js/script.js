const FRONT = "card_front";
const BACK = "card_back";
const CARD = "card";
const ICON = "icon";

const cardClick = document.querySelector("#card-click");
const cardCheck = document.querySelector("#card-check");
const cardWin = document.querySelector("#card-win");
const cardStart = document.querySelector("#card-start");

const button = document.querySelector(".login__button");
const form = document.querySelector(".login-form");

let clickBlocked = true;
let iduser;

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});

function startGame(userid) {
  iduser = userid;
  recuperarTimeScoreUser();
  cardStart.play();
  stopTime();
  startTime();
  initializeCards(game.createCardsFromTechs());

  // Desbloquear cliques após 3 segundos
  setTimeout(() => {
    clickBlocked = false;
  }, 3000);

  if (game.checkMatch()) {
    game.clearCards();
    cardCheck.play();

    if (game.checkGameOver()) {
      let gameOverLayer = document.getElementById("gameOver");
      gameOverLayer.style.display = "flex";

      cardWin.play();
      pauseTime();
      let resultadoP = document.getElementById("resultado");
      let tempoJogo = calculateTime(time);
      resultadoP.textContent = `Parabéns! Tempo de jogo: ${tempoJogo}`;
    }
  }
}

function initializeCards(cards) {
  let gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  game.cards.forEach((card) => {
    let cardElement = document.createElement("div");
    cardElement.id = card.id;
    cardElement.classList.add(CARD);
    cardElement.dataset.icon = card.icon;

    setTimeout(() => {
      cardElement.classList.add("flip");
    }, 300);
    setTimeout(() => {
      cardElement.classList.remove("flip");
    }, 3000);

    createCardContent(card, cardElement);
    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function createCardContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement);
  createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
  let cardElementFace = document.createElement("div");
  cardElementFace.classList.add(face);
  if (face === FRONT) {
    let iconElement = document.createElement("img");
    iconElement.classList.add(ICON);
    iconElement.src = "./img/" + card.icon + ".png";
    cardElementFace.appendChild(iconElement);
  } else {
    let iconElement = document.createElement("img");
    iconElement.classList.add(ICON);
    iconElement.src = "./img/card.png";
    cardElementFace.appendChild(iconElement);
  }
  element.appendChild(cardElementFace);
}

async function saveRecord(time) {
  try {
    let res;
    const response = await fetch("http://localhost:3000/api/record/ecopuzzle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"tempo_record": time}),
      credentials: "include",
    });

    res = await response.json();
    console.log(res)
  } catch (error) {
    console.log(error);
  }
}

function flipCard() {
  if (clickBlocked) return; // Bloquear cliques enquanto clickBlocked for true

  if (game.setCard(this.id)) {
    this.classList.add("flip");
    cardClick.play();

    if (game.secondCard) {
      if (game.checkMatch()) {
        game.clearCards();
        cardCheck.play();

        if (game.checkGameOver()) {
          let gameOverLayer = document.getElementById("gameOver");
          gameOverLayer.style.display = "flex";

          cardWin.play();
          pauseTime();
          let resultadoP = document.getElementById("resultado");
          resultadoP.textContent = `Parabéns! Tempo de jogo: ${calculateTime(
            time
          )}`;
          saveRecord(time);
          compararTime(time);
        }
      } else {
        setTimeout(() => {
          let firstCardView = document.getElementById(game.firstCard.id);
          let secondCardView = document.getElementById(game.secondCard.id);

          firstCardView.classList.remove("flip");
          secondCardView.classList.remove("flip");
          game.unflipCards();
        }, 1000);
      }
    }
  }
}

function restart() {
  game.clearCards();
  compararTime(time);
  startGame();
  cardStart.play();
  let gameOverLayer = document.getElementById("gameOver");
  gameOverLayer.style.display = "none";
}

// ----------------------------------------------

let interval;
let time = 0;
let timeP = document.getElementById("time");

function startTime() {
  let startTime = Date.now() - time;
  interval = setInterval(() => {
    time = Date.now() - startTime;
    timeP.textContent = calculateTime(time);
  }, 1000);
}

function pauseTime() {
  clearInterval(interval);
  timeP.textContent = calculateTime(time);
}

function stopTime() {
  time = 0;
  clearInterval(interval);
  timeP.textContent = "00:00";
}

function calculateTime(time) {
  let totalSeconds = Math.floor(time / 1000);
  let totalMinutes = Math.floor(totalSeconds / 60);

  let displaySeconds = (totalSeconds % 60).toString().padStart(2, "0");
  let displayMinutes = totalMinutes.toString().padStart(2, "0");

  return `${displayMinutes}:${displaySeconds}`;
}

function recuperarTimeScoreUser() {
  let recorde = document.getElementById("recorde");
  // Faz uma requisição HTTP para o arquivo PHP que retorna o JSON
  fetch("http://localhost/projetopa/api/recuperarecorduser.php")
    .then((response) => response.json()) // Analisa a resposta como um objeto JSON
    .then((data) => {
      // Usa o objeto JSON retornado para exibir o tempo de gravação do usuário
      recorde.textContent = data.time_record;
    })
    .catch((error) => console.error(error)); // Lida com erros da requisição HTTP

  return recorde.textContent;
}

function compararTime(time) {
  let recorde = document.getElementById("recorde");
  let timeNovo = calculateTime(time);
  let timeRecordUser = recuperarTimeScoreUser();

  if (timeNovo < timeRecordUser) {
    fetch("http://localhost/projetopa/api/alteratempouser.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        record: timeNovo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        recorde.textContent = data.time_record;
      })
      .catch((error) => console.error(error));
  } else if (timeRecordUser == "00:00") {
    fetch("http://localhost/projetopa/api/alteratempouser.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        record: timeNovo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        recorde.textContent = data.time_record;
      })
      .catch((error) => console.error(error));
  } else if (timeNovo > timeRecordUser) {
    console.log("Você não bateu seu record!");
  }
}

function showHelp() {
  const blurOverlay = document.getElementById('blur-overlay');
  const helpDialog = document.getElementById('help-dialog');

  blurOverlay.style.display = 'block';
  helpDialog.style.display = 'flex';
}

function closeHelp() {
  const blurOverlay = document.getElementById('blur-overlay');
  const helpDialog = document.getElementById('help-dialog');

  blurOverlay.style.display = 'none';
  helpDialog.style.display = 'none';
}

function toggleFullScreen() {
  const fullscreenIcon = document.getElementById('fullscreen-icon');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreenIcon.classList.remove('fa-expand');
      fullscreenIcon.classList.add('fa-compress');
      fullscreenBtn.classList.add('fullscreen');
  } else {
      if (document.exitFullscreen) {
          document.exitFullscreen();
          fullscreenIcon.classList.remove('fa-compress');
          fullscreenIcon.classList.add('fa-expand');
          fullscreenBtn.classList.remove('fullscreen');
      }
  }
}

const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', toggleFullScreen);