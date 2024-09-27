import { requireAuth } from '../../utils/middleware.js';
import { getUser } from '../../utils/auth.js';
import { getCrosswoldRanking } from '../../services/ranking/crossworld.js';
import { getEcopuzzleRanking } from '../../services/ranking/ecopuzzle.js';
import { getHangameRanking } from '../../services/ranking/hangame.js';
import { getQuizRanking } from '../../services/ranking/quiz.js';

document.addEventListener('DOMContentLoaded', async function () {
    await requireAuth();
    const user = getUser();
    if (user) {
        await initializeRanking(user);
    } else {
        console.error("Usuário não encontrado. Redirecionando para login...");
        window.location.href = '/login';
    }
});

async function initializeRanking(user) {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        await handleRanking(1, user);
    } else {
        await loadAllRankingsForMobile(user);
    }

    const tabs = document.querySelectorAll('.tab-header .tab');
    const contents = document.querySelectorAll('.tab-content .content');

    if (!isMobile) {
        tabs.forEach(tab => {
            tab.addEventListener('click', async function () {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                contents.forEach(content => content.classList.remove('active'));
                const tabNumber = tab.getAttribute('data-tab');
                document.getElementById(`tab-${tabNumber}`).classList.add('active');
                await handleRanking(tabNumber, user);
            });
        });
    }

    document.getElementById('btnGoToPerfil').addEventListener('click', () => {
        window.location.href = '../perfil/index.html';
    });
}

async function loadAllRankingsForMobile(user) {
    for (let i = 1; i <= 4; i++) {
        await handleRanking(i, user);
    }
}

async function handleRanking(tabNumber, user) {
    let ranking;

    try {
        // Modificar a chamada para capturar o retorno de maneira correta
        switch (parseInt(tabNumber)) {
            case 1:
                ranking = await getCrosswoldRanking() || [];  // Se retornar array diretamente
                break;
            case 2:
                ranking = await getQuizRanking() || [];
                break;
            case 3:
                ranking = await getHangameRanking() || [];
                break;
            case 4:
                ranking = await getEcopuzzleRanking() || [];
                break;
        }

        // Verifica se o ranking foi retornado corretamente
        if (!ranking || ranking.length === 0) {
            throw new Error(`Ranking não disponível para a aba ${tabNumber}`);
        }

        // Verifica se o usuário logado está no ranking
        let userInRanking = ranking.find(player => player.id_usuario === user.id);
        let userPosition = ranking.findIndex(player => player.id_usuario === user.id) + 1; // Índice + 1 = posição real

        if (userInRanking) {
            userInRanking.posicao = userPosition; // Adiciona a posição correta ao objeto

            // Exibe o jogador logado em "Sua Posição"
            updateRankingTable(ranking, tabNumber, userInRanking);  
        } else {
            let userRanking = {
                posicao: "0",
                nome: "Você ainda não jogou!",
                tempo: 0,   
                erros: 0
            };
            updateRankingTable(ranking, tabNumber, userRanking);
        }
    } catch (error) {
        console.error(`Erro ao carregar o ranking da aba ${tabNumber}:`, error.message);
    }
}

function updateRankingTable(rankingData, tabNumber, user) {
    tabNumber = parseInt(tabNumber);

    const isMobile = window.innerWidth <= 768;
    const tableBody = document.querySelector(isMobile ? `#tab-${tabNumber}-mobile .ranking-table tbody` : `#tab-${tabNumber} .ranking-table tbody`);

    tableBody.innerHTML = '';

    // Exibe a posição do jogador logado em "Sua Posição"
    const userPositionElement = document.querySelector(isMobile ? `#tab-${tabNumber}-mobile .score-user-actual .player p:nth-child(1)` : `#tab-${tabNumber} .score-user-actual .player p:nth-child(1)`);
    const userNameElement = document.querySelector(isMobile ? `#tab-${tabNumber}-mobile .score-user-actual .player p:nth-child(2)` : `#tab-${tabNumber} .score-user-actual .player p:nth-child(2)`);
    const userScoreElement = document.querySelector(isMobile ? `#tab-${tabNumber}-mobile .score-user-actual .player p:nth-child(3)` : `#tab-${tabNumber} .score-user-actual .player p:nth-child(3)`);

    userPositionElement.innerHTML = user.posicao;

    if (user.posicao == 1) {
        userPositionElement.innerHTML = '<i class="fas fa-trophy" style="color: #FFD700;"></i> ' + user.posicao + "º";
    } else if (user.posicao == 2) {
        userPositionElement.innerHTML = '<i class="fas fa-trophy" style="color: #C0C0C0;"></i> ' + user.posicao + "º";
    } else if (user.posicao == 3) {
        userPositionElement.innerHTML = '<i class="fas fa-trophy" style="color: #cd7f32;"></i> ' + user.posicao + "º";
    }

    userNameElement.textContent = user.nome;
    userScoreElement.textContent = (user.tempo / 1000);

    // Adiciona o ranking ao jogador logado com destaque
    rankingData.forEach((player, index) => {
        const row = document.createElement('tr');

        const positionCell = document.createElement('td');
        if (index === 0) {
            positionCell.innerHTML = '<i class="fas fa-trophy" style="color: #FFD700;"></i>';
        } else if (index === 1) {
            positionCell.innerHTML = '<i class="fas fa-trophy" style="color: #C0C0C0;"></i>';
        } else if (index === 2) {
            positionCell.innerHTML = '<i class="fas fa-trophy" style="color: #cd7f32;"></i>';
        } else {
            positionCell.textContent = player.posicao || (index + 1);  // Corrige a posição dos outros jogadores
        }

        row.appendChild(positionCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = player.nome;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = player.tempo / 1000;
        row.appendChild(scoreCell);

        if (tabNumber === 2 || tabNumber === 3) {
            const errorsCell = document.createElement('td');
            errorsCell.textContent = player.erros || 0;
            row.appendChild(errorsCell);
        }

        // Destaca o jogador logado com uma cor diferente
        if (player.id_usuario === user.id_usuario) {
            row.style.backgroundColor = "#dff0d8"; // Cor de destaque
        }

        tableBody.appendChild(row);
    });
}
