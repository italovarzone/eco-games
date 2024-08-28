window.onload = function() {
  const userName = "Nome do Jogador";
  const gamesCompleted = 30;
  const challengesWon = 18;
  const challengesLost = 12;
  const totalPlayTime = "48 horas e 30 minutos";

  console.log(document.querySelector('.games-completed')); // Verifica se o elemento existe
  console.log(document.querySelector('.challenges-won'));
  console.log(document.querySelector('.challenges-lost'));
  console.log(document.querySelector('.total-play-time'));

  document.querySelector('.perfil-info h2').innerText = userName;
  document.querySelector('.games-completed').innerText = gamesCompleted;
  document.querySelector('.challenges-won').innerText = challengesWon;
  document.querySelector('.challenges-lost').innerText = challengesLost;
  document.querySelector('.total-play-time').innerText = totalPlayTime;
};



function goToMenu() {
  window.location.href = '../home/index.html'; 
}

function goToRanking() {
  window.location.href = '../ranking/index.html'; 
}
