function startGame() {
    const quizContainer = document.getElementById('quiz-container');
    const quizContainerWrapper = document.getElementById('quiz-wrapper')
    const resultContainer = document.getElementById('result-container');
    const quizContainerQuestions = document.getElementById('quiz-container-questions');

    resultContainer.style.display = 'none';
    quizContainerWrapper.display = 'flex'
    quizContainerQuestions.style.display = 'flex';

    quizContainer.style.display = 'flex';

    loadQuestion();
  }

function animateOptions() {
  const options = document.querySelectorAll('.option');
  
  options.forEach((option, index) => {
    setTimeout(() => {
      option.style.opacity = '1';
    }, index * 100);
  });
}

const questions = [
  {
    question: "Qual é o objetivo número 1 das ODS?",
    options: ["Erradicar a fome", "Acabar com a pobreza", "Saúde de qualidade", "Educação universal"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS está relacionado à educação de qualidade?",
    options: ["Objetivo 4", "Objetivo 7", "Objetivo 11", "Objetivo 6"],
    correctAnswer: 0
  },
  {
    question: "O que significa a sigla ODS?",
    options: ["Organização para o Desenvolvimento Sustentável", "Objetivos de Desenvolvimento Sustentável", "Ordem para o Desenvolvimento Social", "Orientações para o Desenvolvimento Sustentável"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS aborda a igualdade de gênero?",
    options: ["Objetivo 3", "Objetivo 5", "Objetivo 9", "Objetivo 8"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS está relacionado à ação climática?",
    options: ["Objetivo 6", "Objetivo 13", "Objetivo 15", "Objetivo 12"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS visa a redução das desigualdades?",
    options: ["Objetivo 1", "Objetivo 5", "Objetivo 10", "Objetivo 7"],
    correctAnswer: 2
  },
  {
    question: "Em que ano foi adotada oficialmente a Agenda 2030?",
    options: ["2015", "2020", "2030", "2012"],
    correctAnswer: 0
  },
  {
    question: "Qual ODS está relacionado à vida na água?",
    options: ["Objetivo 11", "Objetivo 14", "Objetivo 17", "Objetivo 16"],
    correctAnswer: 1
  },
  {
    question: "O que representa a sigla ONU?",
    options: ["Organização Nacional Unida", "Ordem das Nações Unidas", "Organização das Nações Unidas", "Orientações das Nações Unidas"],
    correctAnswer: 2
  },
  {
    question: "Qual ODS trata da paz, justiça e instituições eficazes?",
    options: ["Objetivo 8", "Objetivo 16", "Objetivo 20", "Objetivo 18"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS busca a produção e o consumo sustentáveis?",
    options: ["Objetivo 5", "Objetivo 12", "Objetivo 18", "Objetivo 14"],
    correctAnswer: 1
  },
  {
    question: "Qual ODS está relacionado à energia acessível e limpa?",
    options: ["Objetivo 7", "Objetivo 10", "Objetivo 14", "Objetivo 9"],
    correctAnswer: 3
  },
  {
    question: "Qual ODS aborda a saúde mental e bem-estar?",
    options: ["Objetivo 2", "Objetivo 8", "Objetivo 13", "Objetivo 15"],
    correctAnswer: 3
  },
  {
    question: "Qual ODS visa a igualdade racial?",
    options: ["Objetivo 10", "Objetivo 15", "Objetivo 16", "Objetivo 21"],
    correctAnswer: 3
  },
];

const selectedQuestions = shuffleQuestions(questions).slice(0, 5); // Escolhe aleatoriamente 5 perguntas
const timeLimit = 30; // Tempo limite por pergunta em segundos
let timerInterval; // Variável para armazenar o intervalo do cronômetro
let currentTime; // Variável para armazenar o tempo restante

// Função para embaralhar as perguntas
function shuffleQuestions(questionsArray) {
  return questionsArray.sort(() => Math.random() - 0.5);
}

let currentQuestion = 0;
let score = 0;
let questionTimes = []; // Array para armazenar o tempo de cada pergunta

function loadQuestion() {
  const timerElement = document.getElementById('timer');
  const questionContainer = document.getElementById('question-container');
  const optionsContainer = document.getElementById('options-container');
  const resultContainer = document.getElementById('result');
  const nextButton = document.getElementById('next-button');

  startTimer(); // Inicia o cronômetro ao carregar uma nova pergunta

  questionContainer.textContent = selectedQuestions[currentQuestion].question;

  optionsContainer.innerHTML = "";
  selectedQuestions[currentQuestion].options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    button.addEventListener('click', () => checkAnswer(index));
    optionsContainer.appendChild(button);
  });

  resultContainer.textContent = "";
  nextButton.style.display = "none";
}

function startTimer() {
  const timerElement = document.getElementById('timer');
  currentTime = timeLimit;
  timerElement.textContent = `Tempo: ${currentTime}s`;

  timerInterval = setInterval(() => {
    currentTime--;
    timerElement.textContent = `Tempo: ${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timerInterval);
      checkAnswer(-1); // Resposta incorreta (tempo esgotado)
    }
  }, 1000);
}

function checkAnswer(selectedOption) {
  const correctAnswer = selectedQuestions[currentQuestion].correctAnswer;
  const resultContainer = document.getElementById('result');
  const nextButton = document.getElementById('next-button');
  const options = document.querySelectorAll('.option');

  clearInterval(timerInterval); // Para o cronômetro ao verificar a resposta

  options.forEach((option, index) => {
    option.disabled = true;
    if (index === correctAnswer) {
      option.classList.add('correct');
      option.classList.add('correct-answer');
    } else {
      option.classList.add('incorrect');
      option.classList.add('incorrect-answer');
    }

    option.disabled = true; // Desabilita os botões após a resposta
  });

  const questionTime = timeLimit - currentTime;
  questionTimes.push(questionTime); // Armazena o tempo da pergunta

  if (selectedOption === correctAnswer) {
    resultContainer.style.color = '#4caf50';
    resultContainer.textContent = "Resposta correta!";
    score++;
  } else if (selectedOption === -1) {
    resultContainer.style.color = 'orange'
    resultContainer.textContent = `Tempo esgotado! A resposta correta seria a opção ${correctAnswer + 1}`;
  } else {
    resultContainer.style.color = '#e74c3c';
    resultContainer.textContent = "Resposta incorreta.";
  }

  nextButton.style.display = "flex";
}

function nextQuestion() {
  const options = document.querySelectorAll('.option');

  options.forEach((option) => {
    option.classList.remove('correct', 'incorrect');
    option.disabled = false; // Habilita os botões para a próxima pergunta
  });

  currentQuestion++;

  if (currentQuestion < selectedQuestions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    showFinalResult();
  }
}

function showFinalResult() {
  const quizContainerQuestions = document.getElementById('quiz-container-questions');
  const quizContainerWrapper = document.getElementById('quiz-container')
  const resultContainer = document.getElementById('result-container');
  const headerQuizContainer = document.getElementById('header-quiz');
  const correctAnswersElement = document.getElementById('correct-answers');
  const incorrectAnswersElement = document.getElementById('incorrect-answers');
  const percentageElement = document.getElementById('percentage');
  const totalScoreElement = document.getElementById('total-score');
  const totalTimeElement = document.getElementById('total-time');
  const totalTimeSpent = questionTimes.reduce((total, time) => total + time, 0);

  quizContainerQuestions.innerHTML = '';
  resultContainer.style.display = 'flex';
  quizContainerQuestions.style.display = 'none'; // Oculta o container de perguntas
  headerQuizContainer.style.display = 'none';
  quizContainerWrapper.style.display = 'none';
  correctAnswersElement.textContent = score;
  incorrectAnswersElement.textContent = selectedQuestions.length - score;
  percentageElement.textContent = ((score / selectedQuestions.length) * 100).toFixed(2) + '%';
  totalScoreElement.textContent = `${score} / ${selectedQuestions.length}`;
  totalTimeElement.textContent = `${totalTimeSpent} s`; // Exibe o tempo total
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

startGame();