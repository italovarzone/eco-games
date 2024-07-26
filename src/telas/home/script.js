let currentSlide = 0;
let slideInterval;

document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentSlide);
  startSlideShow();
});

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-item');
  if (index >= slides.length) currentSlide = 0;
  if (index < 0) currentSlide = slides.length - 1;
  for (let slide of slides) {
    slide.classList.remove('active');
  }
  slides[currentSlide].classList.add('active');
  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 3000); // Muda de slide a cada 3 segundos
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', stopSlideShow);
carousel.addEventListener('mouseleave', startSlideShow);

document.addEventListener("DOMContentLoaded", () => {
    handleSidebarVisibility();

    window.addEventListener('resize', handleSidebarVisibility);
});

function handleSidebarVisibility() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth < 1000) {
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.add('open');
    }
}

function loadHome() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '<h2>Bem-vindo ao Ecogames</h2>';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function logout() {
    window.location.href = 'logout.html';
}

function showPlayerInfo() {
    const playerInfoContainer = document.getElementById('player-info-container');
    if (playerInfoContainer) {
        playerInfoContainer.style.display = 'block';
    } else {
        console.error('Elemento #player-info-container não encontrado.');
    }
}

function hidePlayerInfo() {
    const playerInfoContainer = document.getElementById('player-info-container');
    if (playerInfoContainer) {
        playerInfoContainer.style.display = 'none';
    } else {
        console.error('Elemento #player-info-container não encontrado.');
    }
}

function goToPerfil() {
    window.location.href = '../perfil/index.html'; 
}

function loadGame(game) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    switch (game) {
        case 'cacapalavras':
            loadCacaPalavras();
            break;
        case 'hangame':
            loadHangame();
            break;
        case 'ecopuzzle':
            loadEcopuzzle();
            break;
        case 'quiz':
            loadQuizODS();
            break;
        default:
            gameContainer.innerHTML = '<h2>Selecione um jogo na barra lateral</h2>';
    }

    // Fechar a sidebar após a seleção do jogo
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
}

function loadCacaPalavras() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <iframe id="game-iframe" src="../../jogos/cacapalavras/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
}

function loadHangame() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <iframe id="game-iframe" src="../../jogos/forca/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
}

function loadEcopuzzle() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <iframe id="game-iframe" src="../../jogos/ecopuzzle/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
}

function loadQuizODS() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <iframe id="game-iframe" src="../../jogos/quiz/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
}

function handleMobileMenuChange(event) {
    const value = event.target.value;
    if (value === 'perfil') {
        goToPerfil();
    } else if (value === 'ranking') {
        // Lógica para ranking
    } else if (value === 'avaliar') {
        // Lógica para avaliar
    } else {
        loadGame(value);
    }
}
