document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-header .tab');
    const contents = document.querySelectorAll('.tab-content .content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            contents.forEach(content => content.classList.remove('active'));
            const tabNumber = tab.getAttribute('data-tab');
            document.getElementById(`tab-${tabNumber}`).classList.add('active');
        });
    });
});

function goToMenu() {
    window.location.href = '../home/index.html'; 
  }
