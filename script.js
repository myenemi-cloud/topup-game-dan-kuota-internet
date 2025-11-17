// Page Navigation
function showClientLogin() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('clientPage').classList.add('active');
}

function showAdminLogin() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('adminLoginPage').classList.add('active');
}

function backToLogin() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
}

function logoutAdmin() {
    document.getElementById('adminPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// Service Switching
function switchService(service) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update service content
    document.querySelectorAll('.service-content').forEach(content => content.classList.remove('active'));
    document.getElementById(service + 'Service').classList.add('active');
}

// Game Selection
document.querySelectorAll('.game-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        document.querySelectorAll('.game-option').forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        this.classList.add('selected');
        // Set hidden input value
        document.getElementById('game').value = this.dataset.game;
    });
});

// Provider Selection
document.querySelectorAll('.provider-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        document.querySelectorAll('.provider-option').forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        this.classList.add('selected');
        // Set hidden input value
        document.getElementById('provider').value = this.dataset.provider;
    });
});

// Game Form Submission
document.getElementById('gameForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const game = document.getElementById('game').value;
    const gameId = document.getElementById('gameId').value;
    const amount = document.getElementById('gameAmount').value;
    const payment = document.getElementById('gamePayment').value;

    if (!game || !gameId || !amount || !payment) {
        showMessage('Harap isi semua field', 'error');
        return;
    }

    // Generate unique ID
    const requestId = Date.now().toString();

    // Create request object
    const request = {
        id: requestId,
        type: 'game',
        service: game,
        identifier: gameId,
        package: amount + ' Diamonds',
        amount: getGameAmountValue(amount),
        payment: payment,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    // Get existing requests
    let requests = JSON.parse(localStorage.getItem('topupRequests')) || [];

    // Add new request
    requests.push(request);

    // Save to localStorage
    localStorage.setItem('topupRequests', JSON.stringify(requests));

    // Reset form
    this.reset();
    // Clear selections
    document.querySelectorAll('.game-option').forEach(opt => opt.classList.remove('selected'));

    // Show success message
    showMessage('Request TopUp Game berhasil dikirim!', 'success');
});

// Kuota Form Submission
document.getElementById('kuotaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const provider = document.getElementById('provider').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const amount = document.getElementById('kuotaAmount').value;
    const payment = document.getElementById('kuotaPayment').value;

    if (!provider || !phoneNumber || !amount || !payment) {
        showMessage('Harap isi semua field', 'error');
        return;
    }

    // Generate unique ID
    const requestId = Date.now().toString();

    // Create request object
    const request = {
        id: requestId,
        type: 'kuota',
        service: provider,
        identifier: phoneNumber,
        package: amount.toUpperCase(),
        amount: getKuotaAmountValue(amount),
        payment: payment,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    // Get existing requests
    let requests = JSON.parse(localStorage.getItem('topupRequests')) || [];

    // Add new request
    requests.push(request);

    // Save to localStorage
    localStorage.setItem('topupRequests', JSON.stringify(requests));

    // Reset form
    this.reset();
    // Clear selections
    document.querySelectorAll('.provider-option').forEach(opt => opt.classList.remove('selected'));

    // Show success message
    showMessage('Request TopUp Kuota berhasil dikirim!', 'success');
});

function getGameAmountValue(diamonds) {
    const amounts = {
        '100': 10000,
        '250': 25000,
        '500': 50000,
        '1000': 100000,
        '2500': 250000
    };
    return amounts[diamonds] || 0;
}

function getKuotaAmountValue(package) {
    const amounts = {
        '5gb': 25000,
        '10gb': 45000,
        '20gb': 75000,
        '30gb': 100000,
        '50gb': 150000,
        '100gb': 250000
    };
    return amounts[package] || 0;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (password === 'admin123') {
        document.getElementById('adminLoginPage').classList.remove('active');
        document.getElementById('adminPage').classList.add('active');
        loadRequests();
    } else {
        showAdminLoginMessage('Password salah', 'error');
    }
});

function showAdminLoginMessage(text, type) {
    const messageDiv = document.getElementById('adminLoginMessage');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Load Admin Requests
function loadRequests() {
    const requests = JSON.parse(localStorage.getItem('topupRequests')) || [];
    const tbody = document.getElementById('requestsBody');
    const statsDiv = document.getElementById('stats');

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">Belum ada request TopUp</td></tr>';
        statsDiv.innerHTML = '';
        return;
    }

    // Calculate stats
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        processed: requests.filter(r => r.status === 'processed').length
    };

    statsDiv.innerHTML = `
        <div class="stat-card">
            <h3>${stats.total}</h3>
            <p>Total Request</p>
        </div>
        <div class="stat-card">
            <h3>${stats.pending}</h3>
            <p>Menunggu</p>
        </div>
        <div class="stat-card">
            <h3>${stats.approved}</h3>
            <p>Disetujui</p>
        </div>
        <div class="stat-card">
            <h3>${stats.rejected}</h3>
            <p>Ditolak</p>
        </div>
        <div class="stat-card">
            <h3>${stats.processed}</h3>
            <p>Diproses</p>
        </div>
    `;

            tbody.innerHTML = requests.map(request => `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.type === 'game' ? 'Game' : 'Kuota'}</td>
                    <td>${getServiceName(request.service, request.type)}</td>
                    <td>${request.identifier}</td>
                    <td>${request.package}</td>
                    <td>Rp ${request.amount.toLocaleString()}</td>
                    <td>${request.payment}</td>
                    <td><span class="status ${request.status}">${request.status}</span></td>
                    <td>${new Date(request.timestamp).toLocaleString('id-ID')}</td>
                    <td>
                        ${request.status === 'pending' ? `
                            <button class="action-btn approve" onclick="updateStatus('${request.id}', 'approved')">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="action-btn reject" onclick="updateStatus('${request.id}', 'rejected')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        ` : request.status === 'approved' ? `
                            <button class="action-btn process" onclick="updateStatus('${request.id}', 'processed')">
                                <i class="fas fa-cog"></i> Process
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
}

function getServiceName(serviceCode, type) {
    if (type === 'game') {
        const games = {
            'mobile-legends': 'Mobile Legends',
            'free-fire': 'Free Fire',
            'pubg-mobile': 'PUBG Mobile',
            'arena-of-valor': 'Arena of Valor',
            'genshin-impact': 'Genshin Impact'
        };
        return games[serviceCode] || serviceCode;
    } else if (type === 'kuota') {
        const providers = {
            'telkomsel': 'Telkomsel',
            'indosat': 'Indosat',
            'xl': 'XL',
            'axis': 'Axis',
            'three': 'Three',
            'smartfren': 'Smartfren'
        };
        return providers[serviceCode] || serviceCode;
    }
    return serviceCode;
}

function updateStatus(id, newStatus) {
    let requests = JSON.parse(localStorage.getItem('topupRequests')) || [];
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index].status = newStatus;
        localStorage.setItem('topupRequests', JSON.stringify(requests));
        loadRequests();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginPage').classList.add('active');

    // Auto refresh every 30 seconds when admin panel is visible
    setInterval(() => {
        if (document.getElementById('adminPage').classList.contains('active')) {
            loadRequests();
        }
    }, 30000);
});
