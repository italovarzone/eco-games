function editProfile() {
    alert('Função de edição de perfil ainda não implementada.');
  }
  
  function goToMenu() {
    window.location.href = '../index.html'; 
  }
  
  function goToRanking() {
    alert('Navegar para o ranking.');
  }
  
  // Exemplo de carregamento de dados do usuário
  document.addEventListener('DOMContentLoaded', (event) => {
    // Você pode substituir esses dados por uma chamada a uma API ou outra fonte de dados
    const userName = "Ítalo";
    const userLevel = 10;
    const userExperience = 1500;
    const gamesCompleted = 25;
    const challengesWon = 10;
    const totalScore = 2000;
  
    document.querySelector('.perfil-info h2').innerText = userName;
    document.querySelector('.perfil-info p:nth-child(2)').innerText = `Nível: ${userLevel}`;
    document.querySelector('.perfil-info p:nth-child(3)').innerText = `Experiência: ${userExperience} XP`;
    document.querySelector('.perfil-stats li:nth-child(1)').innerText = `Jogos Completos: ${gamesCompleted}`;
    document.querySelector('.perfil-stats li:nth-child(2)').innerText = `Desafios Vencidos: ${challengesWon}`;
    document.querySelector('.perfil-stats li:nth-child(3)').innerText = `Pontuação Total: ${totalScore}`;
  });
  