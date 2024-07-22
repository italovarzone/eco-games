const inputs = document.querySelector(".inputs"),
  resetBtns = document.querySelectorAll(".reset-btn"),
  hint = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess-left span"),
  wrongLetter = document.querySelector(".wrong-letter span"),
  typingInput = document.querySelector(".typing-input"),
  gameContainer = document.getElementById("game-container"),
  resultContainer = document.getElementById("result-container"),
  totalErrors = document.getElementById("total-errors"),
  totalTime = document.getElementById("total-time"),
  helpContainer = document.getElementById("help-container"),
  gameTitle = document.getElementById("game-title"),
  gameContent = document.getElementById("game-content");

var word,
  maxGuesses,
  corrects = [],
  incorrects = [],
  score;
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
    button.addEventListener('click', () => handleKeyboardInput(letter, button));
    keyboardContainer.appendChild(button);
  });
}

// Função para lidar com a entrada do teclado virtual
function handleKeyboardInput(letter, button) {
  if (!incorrects.includes(` ${letter}`) && !corrects.includes(letter)) {
    if (word.includes(letter)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] == letter) {
          corrects.push(letter);
          inputs.querySelectorAll("input")[i].value = letter;
        }
      }
    } else {
      maxGuesses--;
      incorrects.push(` ${letter}`);
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrects;
  }
  
  // Desabilitar e marcar o botão após ser clicado
  if (button) {
    button.disabled = true;
    button.classList.add('disabled-button');
  }

  setTimeout(() => {
    if (corrects.length === word.length) {
      stopTimer();
      showResult();
    } else if (maxGuesses < 1) {
      stopTimer();
      showResult();
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  });
}

// Função para alternar a visibilidade do teclado virtual
function toggleKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  const toggleButton = document.getElementById('toggle-keyboard-btn');
  
  if (keyboardContainer.style.display === 'none') {
    keyboardContainer.style.display = 'flex';
  } else {
    keyboardContainer.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createKeyboard();
  const toggleButton = document.getElementById('toggle-keyboard-btn');
  toggleButton.addEventListener('click', toggleKeyboard);
});

function randomWord() {
  startTimer();
  let ranObj = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranObj.word.toUpperCase();  
  maxGuesses = 5;
  corrects = [];
  incorrects = [];

  hint.innerText = ranObj.hint;
  guessLeft.innerText = maxGuesses;
  wrongLetter.innerText = incorrects;

  let html = "";
  for (let i = 0; i < word.length; i++) {
    html += `<input type="text" disabled>`;
  }
  inputs.innerHTML = html;
}

randomWord();

function initGame(e) {
  let key = e.target.value.toUpperCase();  
  if (
    key.match(/^[A-Za-z]+$/) &&
    !incorrects.includes(` ${key}`) &&
    !corrects.includes(key)
  ) {
    if (word.includes(key)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] == key) {
          corrects.push(key);
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else {
      maxGuesses--;
      incorrects.push(` ${key}`);
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrects;
  }
  typingInput.value = "";

  setTimeout(() => {
    if (corrects.length === word.length) {
      stopTimer();
      showResult();
    } else if (maxGuesses < 1) {
      stopTimer();
      showResult();
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  });
}

function showResult() {
  gameContent.style.display = "none";
  resultContainer.style.display = "flex";
  totalErrors.innerText = 5 - maxGuesses;
  totalTime.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function resetGame() {
  resultContainer.style.display = "none";
  gameContent.style.display = "block";
  resetTimer();
  randomWord();
  createKeyboard(); // Recria o teclado
}

resetBtns.forEach(btn => btn.addEventListener("click", (e) => {
  e.preventDefault();
  resetGame();
}));

typingInput.addEventListener("input", initGame);
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
