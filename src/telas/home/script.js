import { requireAuth } from '../../utils/middleware.js';
import { getUser } from '../../utils/auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  await requireAuth();
  const user = getUser();
  console.log(user);
  if (user) {
    updateUI(user);
  }

  handleSidebarVisibility();

  const sidebar = document.querySelector('.sidebar');
  const liGoToPerfil = document.getElementById('liGoToPerfil');
  const liGotoRanking = document.getElementById('liGotoRanking');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const gameOptions = document.querySelectorAll('.game-option');
  
  window.addEventListener('resize', handleSidebarVisibility); // Adicionar listener para redimensionamento da tela
  
  liGoToPerfil.addEventListener('click', () => {
    window.location.href = '../perfil/index.html';
  });  

  liGotoRanking.addEventListener('click', () => {
    window.location.href = '../ranking/index.html';
  });

  gameOptions.forEach(option => {
    option.addEventListener('click', () => {
      const game = option.getAttribute('data-game');
      loadGame(game);
    });
  });

  btnToggleSidebar.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    } else {
      sidebar.classList.add('open');
    }
  });

  btnContinuePlaying.addEventListener('click', () => {
    gameAlertModal.style.display = "none";
  });

  btnExitGame.addEventListener('click', () => {
    gameAlertModal.style.display = "none";
    isGameActive = false;
    if (pendingNavigation) {
      navigateToLink(pendingNavigation);
      pendingNavigation = null;
    }
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener('click', (event) => {
    if (event.target == gameAlertModal) {
      gameAlertModal.style.display = "none";
    }
  });

  function navigateToLink(link) {
    const game = link.getAttribute('data-game');
    if (game) {
      loadGame(game);  // Carrega o jogo
    } else {
      const href = link.getAttribute('data-href');
      if (href) {
        window.location.href = href;  // Navega para o link
      }
    }
  }

  function loadGame(game) {
    isGameActive = true;  // Agora o jogo está ativo
    gameContainer.innerHTML = '';  // Limpa o container do jogo

    let iframeSrc = '';
    switch (game) {
      case 'cacapalavras':
        iframeSrc = "../../jogos/cacapalavras/index.html";
        break;
      case 'hangame':
        iframeSrc = "../../jogos/forca/index.html";
        break;
      case 'ecopuzzle':
        iframeSrc = "../../jogos/ecopuzzle/index.html";
        break;
      case 'quiz':
        iframeSrc = "../../jogos/quiz/index.html";
        break;
      default:
        gameContainer.innerHTML = '<h2>Selecione um jogo na barra lateral</h2>';
        isGameActive = false;
        return;
    }

    gameContainer.innerHTML = `
      <iframe id="game-iframe" src="${iframeSrc}" style="width: 100%; height: 100%; border: none;"></iframe>
    `;
  }
});

const updateUI = (user) => {
  document.getElementById('msgOla').innerText = `Olá, ${user.name}`;
  // Adicione outras atualizações de interface conforme necessário
};

function handleSidebarVisibility() {
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth < 1000) {
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.add('open');
  }
}

function logout() {
  window.location.href = 'logout.html';
}

function goToRanking() {
  window.location.href = '../ranking/index.html';
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

  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.remove('open');  // Fecha a sidebar após seleção do jogo
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

let currentSlide = 0;
let startX;
let isDragging = false;
let slideInterval;

function showSlide(slideIndex, carousel) {
  const slides = document.querySelectorAll(carousel + ' .carousel-item');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');

  if (slideIndex >= slides.length) {
    currentSlide = 0;
  } else if (slideIndex < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = slideIndex;
  }

  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${-currentSlide * 100}%)`;
  });

  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentSlide) {
      indicator.classList.add('active');
    }
  });
}

function nextSlide() {
  const carousel = window.innerWidth >= 1000 ? '.desktop-carousel' : '.mobile-carousel';
  showSlide(currentSlide + 1, carousel);
}

function goToSlide(slideIndex) {
  const carousel = window.innerWidth >= 1000 ? '.desktop-carousel' : '.mobile-carousel';
  showSlide(slideIndex, carousel);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  isDragging = true;
  stopSlideShow();
}

function handleTouchMove(event) {
  if (!isDragging) return;
  const currentX = event.touches[0].clientX;
  const diffX = startX - currentX;

  const carousel = window.innerWidth >= 1000 ? '.desktop-carousel' : '.mobile-carousel';
  if (diffX > 50) {
    nextSlide();
    isDragging = false;
  } else if (diffX < -50) {
    currentSlide--;
    const slides = document.querySelectorAll(carousel + ' .carousel-item');
    currentSlide = currentSlide < 0 ? slides.length - 1 : currentSlide;
    showSlide(currentSlide, carousel);
    isDragging = false;
  }
}

function handleTouchEnd() {
  isDragging = false;
  startSlideShow();
}

// Inicializa o carrossel ao carregar a página
window.addEventListener('load', () => {
  const carousel = window.innerWidth >= 1000 ? '.desktop-carousel' : '.mobile-carousel';
  showSlide(currentSlide, carousel);
  startSlideShow();

  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);
  });
});

// Atualiza o carrossel ao redimensionar a janela
window.addEventListener('resize', () => {
  const carousel = window.innerWidth >= 1000 ? '.desktop-carousel' : '.mobile-carousel';
  showSlide(currentSlide, carousel);
});