const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadRequests();
    } else {
        showLoginMessage('Invalid password', 'error');
    }
});

function showLoginMessage(text, type) {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

function logout() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('password').value = '';
}

function loadRequests() {
    const requests = JSON.parse(localStorage.getItem('topupRequests')) || [];
    const tbody = document.getElementById('requestsBody');
    const statsDiv = document.getElementById('stats');

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No top-up requests found.</td></tr>';
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
        <div class="stat"><h3>${stats.total}</h3><p>Total Requests</p></div>
        <div class="stat"><h3>${stats.pending}</h3><p>Pending</p></div>
        <div class="stat"><h3>${stats.approved}</h3><p>Approved</p></div>
        <div class="stat"><h3>${stats.rejected}</h3><p>Rejected</p></div>
        <div class="stat"><h3>${stats.processed}</h3><p>Processed</p></div>
    `;

    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${request.id}</td>
            <td>${request.gameId}</td>
            <td>Rp ${request.amount.toLocaleString()}</td>
            <td>${request.payment}</td>
            <td><span class="status ${request.status}">${request.status}</span></td>
            <td>${new Date(request.timestamp).toLocaleString()}</td>
            <td>
                ${request.status === 'pending' ? `
                    <button class="action-btn approve" onclick="updateStatus('${request.id}', 'approved')">Approve</button>
                    <button class="action-btn reject" onclick="updateStatus('${request.id}', 'rejected')">Reject</button>
                ` : request.status === 'approved' ? `
                    <button class="action-btn process" onclick="updateStatus('${request.id}', 'processed')">Process</button>
                ` : ''}
            </td>
        </tr>
    `).join('');
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

// Auto refresh every 30 seconds when panel is visible
setInterval(() => {
    if (document.getElementById('adminPanel').style.display !== 'none') {
        loadRequests();
    }
}, 30000);
