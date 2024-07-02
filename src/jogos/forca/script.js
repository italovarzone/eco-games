const inputs = document.querySelector(".inputs"),
  resetBtn = document.querySelector(".reset-btn"),
  hint = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess-left span"),
  wrongLetter = document.querySelector(".wrong-letter span"),
  typingInput = document.querySelector(".typing-input");

var word,
  maxGuesses,
  corrects = [],
  incorrects = [],
  score;
var seconds = 00;
var tens = 00;
var Interval;

const startTimer = () => {
  function runTimer() {
    tens++;
    if (tens > 99) {
      seconds++;
      tens = 0;
    }
  }

  clearInterval(Interval);
  Interval = setInterval(runTimer, 10);
};

const stopTimer = () => {
  clearInterval(Interval);
};

const resetTimer = () => {
  clearInterval(Interval);
  tens = "00";
  seconds = "00";
};

function randomWord() {
  startTimer();
  // Pega um objeto aleatório da nossa lista de palavras
  let ranObj = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranObj.word; // Pega uma palavra de um objeto aleatório
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
  let key = e.target.value.toLowerCase();
  if (
    key.match(/^[A-Za-z]+$/) &&
    !incorrects.includes(` ${key}`) &&
    !corrects.includes(key)
  ) {
    if (word.includes(key)) {
      //Se a letra inserida é encontrada na palavra
      for (let i = 0; i < word.length; i++) {
        //mostrando a letra correta no valor inserido
        if (word[i] == key) {
          corrects.push(key);
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else {
      maxGuesses--; // diminui o número de tentativas
      incorrects.push(` ${key}`);
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrects;
    switch (maxGuesses) {
      case 5:
        score = 10;
        break;
      case 4:
        score = 8;
        break;
      case 3:
        score = 6;
        break;
      case 2:
        score = 4;
        break;
      case 1:
        score = 2;
        break;
    }
  }
  typingInput.value = "";

  setTimeout(() => {
    if (corrects.length === word.length) {
      stopTimer();
      alert(
        `Parabéns! Você acertou a palavra ${word.toUpperCase()} e seu score é ${score}, com ${seconds} segundos!`
      );
      resetTimer();
      randomWord(); //Chama a função de palavra aleatória, assim um novo jogo começa
    } else if (maxGuesses < 1) {
      //se o jogador não conseguir achar todas as letras
      alert("Game over! Você não tem mais tentativas.");
      for (let i = 0; i < word.length; i++) {
        resetTimer();
        //mostrando todas as letras no game over
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  });
}

function togglePopup() {
  document.getElementById("popup-1").classList.toggle("active");
}

resetBtn.addEventListener("click", (e) => {
  e.preventDefault();

  resetTimer();
  randomWord();
});
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
