const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const gameContainer = document.getElementById('game-container');
const sidebarList = document.querySelector('.sidebar ul');

toggleSidebarBtn.addEventListener('click', function() {
    sidebar.classList.toggle('closed');
    content.classList.toggle('closed');

    if (sidebar.classList.contains('closed')) {
        gameContainer.style.width = '100%';
        sidebarList.classList.add('disabled');
    } else {
        gameContainer.style.width = 'calc(100% - 200px)';
        sidebarList.classList.remove('disabled');
    }
});

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

    if (sidebar.classList.contains('closed')) {
        sidebar.classList.remove('closed');
        content.classList.remove('closed');
        gameContainer.style.width = 'calc(100% - 200px)';
        sidebarList.classList.remove('disabled');
    }
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

function finishCrossWorld() {
    const gameContainer = document.getElementById('game-container');
    const iframe = document.getElementById('game-iframe');

    if (iframe) {
        iframe.remove();
    }

    gameContainer.innerHTML = '<h2>Bem-vindo à Plataforma de Jogos</h2>'; // Mensagem padrão após retornar ao menu

    // Mostra o conteúdo principal da plataforma
    content.classList.remove('closed');
    sidebar.classList.remove('closed');
    gameContainer.style.width = 'calc(100% - 200px)';
    sidebarList.classList.remove('disabled');
}