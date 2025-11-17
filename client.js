document.getElementById('topupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const gameId = document.getElementById('gameId').value;
    const amount = document.getElementById('amount').value;
    const payment = document.getElementById('payment').value;

    if (!gameId || !amount || !payment) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    // Generate unique ID
    const requestId = Date.now().toString();

    // Create request object
    const request = {
        id: requestId,
        gameId: gameId,
        amount: parseInt(amount),
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

    // Show success message
    showMessage('TopUp request submitted successfully!', 'success');
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}
