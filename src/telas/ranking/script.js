import { getCrosswoldRanking } from '../../services/ranking/crossworld.js';
import { getEcopuzzleRanking } from '../../services/ranking/ecopuzzle.js';
import { getHangameRanking } from '../../services/ranking/hangame.js';
import { getQuizRanking } from '../../services/ranking/quiz.js';

document.addEventListener('DOMContentLoaded', async function () {
    const numeroTabCrossworld = 1;
    await handleRanking(numeroTabCrossworld);
    
    const btnGoToMenu = document.getElementById('btnGotoMenu');

    const tabs = document.querySelectorAll('.tab-header .tab');
    const contents = document.querySelectorAll('.tab-content .content');
    const slider = document.querySelector('.mobile-slider');

    // Lógica de abas para desktop
    if (window.innerWidth > 768) {
        tabs.forEach(tab => {
            tab.addEventListener('click', async function () {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                contents.forEach(content => content.classList.remove('active'));
                const tabNumber = tab.getAttribute('data-tab');
                document.getElementById(`tab-${tabNumber}`).classList.add('active');
                await handleRanking(tabNumber);
            });
        });
    } else {
        // Lógica de "arrastar para o lado" para mobile
        let startX;
        let currentX;
        let isDragging = false;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            slider.scrollLeft += startX - currentX;
        });

        slider.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    btnGoToMenu.addEventListener('click', () => {
        window.location.href = '../home/index.html';
      });
});

async function handleRanking(tabNumber) {
    let ranking;
    let userId;
    switch (parseInt(tabNumber)) {
        case 1:
            ({ranking, userId} = await getCrosswoldRanking()); 
            console.log(ranking);
            break;

        case 2:
            ({ranking, userId} = await getQuizRanking());
            console.log(ranking);
            break;
        case 3:
            ({ranking, userId} = await getHangameRanking());
            console.log(ranking);
            break;
        case 4:
            ({ranking, userId} = await getEcopuzzleRanking());
            console.log(ranking);
            break;
    }

    if (ranking[0].id === userId) {
        let user = ranking.shift();
        console.log(user)
        updateRankingTable(ranking, tabNumber, user);
    } else {
        let user = {
            posicao: "0",
            nome: "voce ainda nao jogou",
            tempo: 0,   
            erros: 0
        };
        updateRankingTable(ranking, tabNumber, user);
    }


    function updateRankingTable(rankingData, tabNumber, user) {
        tabNumber = parseInt(tabNumber);

        // Seleciona o tbody da tabela específica
        const tableBody = document.querySelector(`#tab-${tabNumber} .ranking-table tbody`);
        
        // Limpa qualquer conteúdo anterior da tabela
        tableBody.innerHTML = '';
    
        const userPositionElement = document.querySelector(`#tab-${tabNumber} .score-user-actual .player p:nth-child(1)`);
        const userNameElement = document.querySelector(`#tab-${tabNumber} .score-user-actual .player p:nth-child(2)`);
        const userScoreElement = document.querySelector(`#tab-${tabNumber} .score-user-actual .player p:nth-child(3)`);
        
        // Atualiza as informações do usuário atual
        userPositionElement.textContent = user.posicao;
        userNameElement.textContent = user.nome;
        userScoreElement.textContent = (user.tempo / 1000);
    
        // Itera sobre os dados de ranking e cria as linhas da tabela
        rankingData.forEach(player => {
            const row = document.createElement('tr');
    
            // Adiciona a posição do jogador
            const positionCell = document.createElement('td');
            positionCell.textContent = player.posicao;
            row.appendChild(positionCell);
    
            // Adiciona o nome do jogador
            const nameCell = document.createElement('td');
            nameCell.textContent = player.nome;
            row.appendChild(nameCell);
    
            // Adiciona a pontuação/tempo do jogador
            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.tempo / 1000;
            row.appendChild(scoreCell);
    
            // Se o tabNumber for 2 ou 3, adiciona a coluna de erros
            if (tabNumber === 2 || tabNumber === 3) {
                const errorsCell = document.createElement('td');
                errorsCell.textContent = player.erros; // Garante que erros tenha um valor válido
                row.appendChild(errorsCell);
            }
    
            // Insere a linha na tabela
            tableBody.appendChild(row);
        });
    }

}


