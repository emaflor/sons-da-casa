// Credenciais de acesso
const ADMIN_EMAIL = 'sonsdacasa@gmail.com';
const ADMIN_PASSWORD = 'SonsDaCasa2026!';

// Variáveis globais
let isLoggedIn = false;

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        sessionStorage.setItem('sonsdacasa_logged', 'true');
        sessionStorage.setItem('sonsdacasa_user', email);
        
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        document.getElementById('user-info').textContent = `Olá, ${email}`;
        
        loadAdminData();
    } else {
        messageEl.className = 'form-message show error';
        messageEl.textContent = '✗ Email ou password incorretos';
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('sonsdacasa_logged');
    sessionStorage.removeItem('sonsdacasa_user');
    location.reload();
});

// Verificar sessão
function checkSession() {
    if (sessionStorage.getItem('sonsdacasa_logged') === 'true') {
        isLoggedIn = true;
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        const user = sessionStorage.getItem('sonsdacasa_user');
        document.getElementById('user-info').textContent = `Olá, ${user}`;
        loadAdminData();
    }
}

// Navegação entre abas
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remover active de todos
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Adicionar active ao clicado
        this.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// CARREGAMENTO DE DADOS
function loadAdminData() {
    loadOrders();
    loadSongs();
    loadStatistics();
}

// 1. CARREGAR PEDIDOS
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('sonsdacasa_orders')) || [];
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');

    if (orders.length === 0) {
        noOrders.style.display = 'block';
        ordersList.innerHTML = '';
        return;
    }

    noOrders.style.display = 'none';
    ordersList.innerHTML = orders.reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-name">${order.nome}</div>
                    <div class="order-date">${order.data}</div>
                </div>
                <span class="status-badge" style="background: ${order.status === 'Pendente' ? '#f97316' : '#10b981'}; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                    ${order.status}
                </span>
            </div>
            <div class="order-info">
                <div class="order-info-item">
                    <span class="order-info-label">📧 Email:</span>
                    <span><a href="mailto:${order.email}">${order.email}</a></span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">📞 Telefone:</span>
                    <span>${order.telefone}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">🎵 Tema:</span>
                    <span>${order.tema}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">🎶 Género:</span>
                    <span>${order.genero}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">⏱️ Duração:</span>
                    <span>${order.duracao}s</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">👥 Pessoas:</span>
                    <span>${order.nomes}</span>
                </div>
            </div>
            <div class="order-description">
                <strong>Descrição:</strong><br>
                ${order.descricao}
            </div>
        </div>
    `).join('');
}

// 2. CARREGAR CANÇÕES
function loadSongs() {
    const songs = JSON.parse(localStorage.getItem('sonsdacasa_songs')) || [];
    const songsList = document.getElementById('songs-list');
    const noSongs = document.getElementById('no-songs');

    if (songs.length === 0) {
        noSongs.style.display = 'block';
        songsList.innerHTML = '';
        return;
    }

    noSongs.style.display = 'none';
    songsList.innerHTML = songs.map(song => `
        <div class="songs-management-item">
            <div>
                <h4>${song.name}</h4>
                <p>${song.description}</p>
                <p style="font-size: 12px;">🔗 ${song.url.substring(0, 50)}...</p>
            </div>
            <button class="btn-delete" onclick="deleteSong(${song.id})">Eliminar</button>
        </div>
    `).join('');
}

// 3. ADICIONAR CANÇÃO
document.getElementById('add-song-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newSong = {
        id: Date.now(),
        name: document.getElementById('song-name').value,
        description: document.getElementById('song-description').value,
        url: document.getElementById('song-url').value
    };

    const songs = JSON.parse(localStorage.getItem('sonsdacasa_songs')) || [];
    songs.push(newSong);
    localStorage.setItem('sonsdacasa_songs', JSON.stringify(songs));

    // Limpar formulário
    this.reset();

    // Recarregar lista
    loadSongs();

    // Notificar sucesso
    alert('✓ Canção adicionada com sucesso!');
});

// 4. ELIMINAR CANÇÃO
function deleteSong(id) {
    if (!confirm('Tem certeza que quer eliminar esta canção?')) return;

    let songs = JSON.parse(localStorage.getItem('sonsdacasa_songs')) || [];
    songs = songs.filter(song => song.id !== id);
    localStorage.setItem('sonsdacasa_songs', JSON.stringify(songs));

    loadSongs();
}

// 5. ESTATÍSTICAS
function loadStatistics() {
    const orders = JSON.parse(localStorage.getItem('sonsdacasa_orders')) || [];
    
    // Total de pedidos
    document.getElementById('total-orders').textContent = orders.length;

    // Géneros populares
    const genres = {};
    orders.forEach(order => {
        genres[order.genero] = (genres[order.genero] || 0) + 1;
    });
    
    const genresChart = document.getElementById('genres-chart');
    genresChart.innerHTML = Object.entries(genres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre, count]) => `
            <div class="chart-item">
                <span class="chart-item-label">${genre}</span>
                <span>${count} pedido${count > 1 ? 's' : ''}</span>
            </div>
        `).join('') || '<p style="text-align: center; opacity: 0.7;">Sem dados</p>';

    // Ocasiões populares
    const occasions = {};
    orders.forEach(order => {
        occasions[order.tema] = (occasions[order.tema] || 0) + 1;
    });
    
    const occasionsChart = document.getElementById('occasions-chart');
    occasionsChart.innerHTML = Object.entries(occasions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([occasion, count]) => `
            <div class="chart-item">
                <span class="chart-item-label">${occasion}</span>
                <span>${count} pedido${count > 1 ? 's' : ''}</span>
            </div>
        `).join('') || '<p style="text-align: center; opacity: 0.7;">Sem dados</p>';

    // Durações
    const durations = {};
    orders.forEach(order => {
        durations[order.duracao + 's'] = (durations[order.duracao + 's'] || 0) + 1;
    });
    
    const durationChart = document.getElementById('duration-chart');
    durationChart.innerHTML = Object.entries(durations)
        .sort((a, b) => b[1] - a[1])
        .map(([duration, count]) => `
            <div class="chart-item">
                <span class="chart-item-label">${duration}</span>
                <span>${count} pedido${count > 1 ? 's' : ''}</span>
            </div>
        `).join('') || '<p style="text-align: center; opacity: 0.7;">Sem dados</p>';
}

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
});