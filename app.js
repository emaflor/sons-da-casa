// Dados de exemplo (armazenados em localStorage)
const defaultSongs = [
    {
        id: 1,
        name: "Aniversário da Sofia",
        description: "Uma canção alegre para celebrar os 7 anos da Sofia",
        url: "https://drive.google.com/uc?export=download&id=1OchWI0mgO83lSZ0xmFgpIwBB1JXAcc9e"
    },
    {
        id: 2,
        name: "Amor Eterno",
        description: "Uma dedicatória de amor especial",
        url: "https://drive.google.com/uc?export=download&id=1OchWI0mgO83lSZ0xmFgpIwBB1JXAcc9e"
    },
    {
        id: 3,
        name: "Saudade",
        description: "Uma canção melódica sobre saudade",
        url: "https://drive.google.com/uc?export=download&id=1OchWI0mgO83lSZ0xmFgpIwBB1JXAcc9e"
    }
];

// Inicializar localStorage com dados padrão
function initializeDefaultData() {
    if (!localStorage.getItem('sonsdacasa_songs')) {
        localStorage.setItem('sonsdacasa_songs', JSON.stringify(defaultSongs));
    }
    if (!localStorage.getItem('sonsdacasa_orders')) {
        localStorage.setItem('sonsdacasa_orders', JSON.stringify([]));
    }
}

// Carregar canções exemplos
function loadSongs() {
    const songsGrid = document.getElementById('songs-grid');
    const songs = JSON.parse(localStorage.getItem('sonsdacasa_songs')) || [];
    
    if (songs.length === 0) {
        songsGrid.innerHTML = '<div class="empty-state">Nenhuma canção disponível ainda</div>';
        return;
    }

    songsGrid.innerHTML = songs.map(song => `
        <div class="song-card">
            <h3 class="song-title">${song.name}</h3>
            <p class="song-description">${song.description}</p>
            <audio class="song-player" controls>
                <source src="${song.url}" type="audio/mpeg">
                Seu navegador não suporta reprodução de áudio.
            </audio>
        </div>
    `).join('');
}

// Submeter formulário de pedido
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value || '-',
        tema: document.getElementById('tema').value,
        genero: document.getElementById('genero').value,
        descricao: document.getElementById('descricao').value,
        nomes: document.getElementById('nomes').value || '-',
        duracao: document.getElementById('duracao').value,
        data: new Date().toLocaleString('pt-PT'),
        status: 'Pendente'
    };

    // Guardar pedido
    const orders = JSON.parse(localStorage.getItem('sonsdacasa_orders')) || [];
    orders.push(formData);
    localStorage.setItem('sonsdacasa_orders', JSON.stringify(orders));

    // Mostrar mensagem de sucesso
    const messageEl = document.getElementById('form-message');
    messageEl.className = 'form-message show success';
    messageEl.textContent = '✓ Pedido enviado com sucesso! Receberá uma resposta em breve.';

    // Limpar formulário
    this.reset();

    // Esconder mensagem após 5 segundos
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
});

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultData();
    loadSongs();
});