const inputs = document.querySelector(".inputs"),
  resetBtns = document.querySelectorAll(".reset-btn"),
  hint = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess-left span"),
  typingInput = document.querySelector(".typing-input"),
  gameContainer = document.getElementById("game-container"),
  resultContainer = document.getElementById("result-container"),
  totalErrors = document.getElementById("total-errors"),
  totalTime = document.getElementById("total-time"),
  resultMessage = document.getElementById("result-message"),
  helpContainer = document.getElementById("help-container"),
  gameTitle = document.getElementById("game-title"),
  gameContent = document.getElementById("game-content");

var word,
  maxGuesses,
  corrects = [],
  incorrects = [],
  gameOver = false;
var seconds = 0;
var minutes = 0;
var Interval;

const startTimer = () => {
  function runTimer() {
    seconds++;
    if (seconds > 59) {
      minutes++;
      seconds = 0;
    }
    document.getElementById("time").innerText = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  clearInterval(Interval);
  Interval = setInterval(runTimer, 1000);
};

const stopTimer = () => {
  clearInterval(Interval);
};

const resetTimer = () => {
  clearInterval(Interval);
  minutes = 0;
  seconds = 0;
  document.getElementById("time").innerText = `00:00`;
};

function createKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  keyboardContainer.innerHTML = ''; // Limpa o conteúdo anterior
  
  alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter;
    button.addEventListener('click', () => handleInput(letter, button));
    keyboardContainer.appendChild(button);
  });
}

// Função para lidar com a entrada do teclado virtual e físico
function handleInput(key, button) {
  if (gameOver) return; // Não permitir entradas após o término do jogo
  
  key = key.toUpperCase();
  if (!corrects.includes(key) && /^[A-Z]+$/.test(key)) {
    if (word.includes(key)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] === key) {
          corrects.push(key);
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else if (!incorrects.includes(key)) {
      incorrects.push(key);
      maxGuesses--;
    }
    guessLeft.innerText = maxGuesses;
  }

  // Desabilitar e marcar o botão após ser clicado
  if (button) {
    button.disabled = true;
    button.classList.add('disabled-button');
  }

  setTimeout(() => {
    if (corrects.length === word.length) {
      stopTimer();
      showResult(true); 
    } else if (maxGuesses < 1) {
      stopTimer();
      showResult(false); 
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createKeyboard();
  typingInput.addEventListener("input", (e) => handleInput(e.target.value));
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    const button = Array.from(document.querySelectorAll('.keyboard-container button'))
      .find(btn => btn.innerText === key);
    handleInput(key, button);
  });
  typingInput.focus(); // Definir o foco automaticamente ao carregar a página
});

function randomWord() {
  gameOver = false; // Reiniciar o estado de jogo
  startTimer();
  let ranObj = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranObj.word.toUpperCase();  
  maxGuesses = 5;
  corrects = [];
  incorrects = [];

  hint.innerText = ranObj.hint;
  guessLeft.innerText = maxGuesses;

  let html = "";
  for (let i = 0; i < word.length; i++) {
    html += `<input type="text" disabled>`;
  }
  inputs.innerHTML = html;
}

randomWord();

function showResult(won) { 
  gameOver = true; // Marcar o jogo como terminado
  gameContent.style.display = "none";
  resultContainer.style.display = "flex";
  totalErrors.innerText = incorrects.length;
  totalTime.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (won) {
    resultMessage.innerText = "Parabéns! Você ganhou!";
  } else {
    resultMessage.innerText = "Que pena! Você perdeu. Tente novamente!";
  }
}

function resetGame() {
  resultContainer.style.display = "none";
  gameContent.style.display = "block";
  resetTimer();
  randomWord();
  createKeyboard(); // Recria o teclado
  typingInput.focus(); // Definir o foco automaticamente ao resetar o jogo
}

resetBtns.forEach(btn => btn.addEventListener("click", (e) => {
  e.preventDefault();
  resetGame();
}));

inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());

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
