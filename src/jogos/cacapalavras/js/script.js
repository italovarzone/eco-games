const words = ["VERDE", "MAR", "AGUA", "POBRE", "FOME", "EDUCACAO", "AQUATICO", "NATUREZA"];
const maxLetters = getMaxLetters(words);
const crossword = document.getElementById("crossword");
const wordList = document.getElementById("wordList");
const timerElement = document.getElementById("timer");
const gameContainer = document.getElementById("game-container");
const congratulationsContainer = document.getElementById("congratulations-container");
const dialogOverlay = document.getElementById("dialog-overlay");
let isMouseDown = false;
let timerInterval;
let seconds = 0;

for (let row = 0; row < 15; row++) {
  for (let col = 0; col < 15; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener("mousedown", () => handleCellMouseDown(cell));
    crossword.appendChild(cell);
  }
}

words.forEach((word, index) => {
  const direction = index % 2 === 0 ? "horizontal" : "vertical";
  let startRow, startCol;

  do {
    startRow = direction === 'horizontal' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 15);
    startCol = direction === 'vertical' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 15);
  } while (!isSafePlacement(word, startRow, startCol, direction));

  for (let i = 0; i < word.length; i++) {
    const cell = crossword.querySelector(`[data-row="${direction === 'horizontal' ? startRow : startRow + i}"][data-col="${direction === 'vertical' ? startCol : startCol + i}"]`);
    cell.textContent = word[i];
    cell.dataset.word = word;
  }
});

words.forEach(word => {
  const wordItem = document.createElement("div");
  wordItem.classList.add("word-item");
  wordItem.textContent = word;
  wordItem.addEventListener("click", () => toggleWordStrike(word));
  wordList.appendChild(wordItem);
});

for (let row = 0; row < 15; row++) {
  for (let col = 0; col < 15; col++) {
    const cell = crossword.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell.textContent) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      cell.textContent = randomLetter;
    }
  }
}

timerInterval = setInterval(updateTimer, 1000);

function getMaxLetters(words) {
  return Math.max(...words.map(word => word.length));
}

function isSafePlacement(word, startRow, startCol, direction) {
  const endRow = direction === 'horizontal' ? startRow : startRow + word.length - 1;
  const endCol = direction === 'vertical' ? startCol : startCol + word.length - 1;

  if (endRow >= 15 || endCol >= 15) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const cell = crossword.querySelector(`[data-row="${direction === 'horizontal' ? startRow : startRow + i}"][data-col="${direction === 'vertical' ? startCol : startCol + i}"]`);
    if (cell.textContent && cell.textContent !== word[i]) {
      return false; 
    }
  }
  return true;
}

function handleCellMouseDown(cell) {
isMouseDown = true;
handleCellSelection(cell);
document.addEventListener("mouseover", handleCellMouseOver);
document.addEventListener("mouseup", handleMouseUp);

function handleMouseUp() {
  isMouseDown = false;
  document.removeEventListener("mouseover", handleCellMouseOver);
  document.removeEventListener("mouseup", handleMouseUp);
  resetSelectedCells();
}
}

function handleCellMouseOver(event) {
if (isMouseDown && event.target.classList.contains("cell") && !event.target.classList.contains("correct")) {
  const selectedCells = document.querySelectorAll('.cell.selected');
  const maxSelectedCells = maxLetters;

  if (selectedCells.length >= maxSelectedCells) {
    resetSelectedCells();
  }

  handleCellSelection(event.target);
}
}

function handleCellSelection(cell) {
cell.classList.toggle("selected");
toggleWordStrike(cell.dataset.word);
}

function resetSelectedCells() {
const selectedCells = document.querySelectorAll('.cell.selected');
selectedCells.forEach(selectedCell => {
  selectedCell.classList.remove('selected');
  toggleWordStrike(selectedCell.dataset.word);
});
}

function toggleWordStrike(word) {
  const wordItems = document.querySelectorAll(".word-item");
  const cells = document.querySelectorAll(".cell");

  wordItems.forEach(item => {
    if (item.textContent === word) {
      const selectedWordCells = Array.from(cells).filter(cell => cell.classList.contains("selected") && cell.dataset.word === word);
      if (selectedWordCells.length === word.length) {
        item.classList.add("strikethrough");
        selectedWordCells.forEach(cell => {
          cell.classList.remove("selected");
          cell.classList.add("correct");
        });
      } else {
        item.classList.remove("strikethrough");
      }
    }
  });
  updateWordList();
}

function updateWordList() {
  const wordItems = document.querySelectorAll(".word-item");
  const cells = document.querySelectorAll(".cell");

  let allWordsFound = true;

  wordItems.forEach(item => {
    if (!item.classList.contains("strikethrough")) {
      allWordsFound = false;
    }
  });

  if (allWordsFound) {
    clearInterval(timerInterval);
    showDialog();
  }
}

function updateTimer() {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerElement.textContent = `Tempo: ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function showDialog() {
  clearInterval(timerInterval);
  const gameContainer = document.getElementById("game-container");
  const gameResultContainer = document.getElementById("game-result-container");
  const totalTimeElement = document.getElementById("total-time");
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  totalTimeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  
  gameContainer.style.display = "none";
  gameResultContainer.style.display = "block";
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

function goToMenu() {
  window.location.href = '../index.html';
}

// Função para alternar entre tela cheia e modo normal
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
  
  // Associando a função ao botão
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn.addEventListener('click', toggleFullScreen);

  document.getElementById('return-to-menu-btn').addEventListener('click', function() {
    // Chama a função para destruir o iframe e retornar ao menu
    parent.finishCrossWorld();
});