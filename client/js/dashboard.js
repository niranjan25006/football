const API_URL = 'https://football-mf27.onrender.com/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userName').innerText = user.username + (user.role === 'admin' ? ' (Admin)' : '');

    // Hide admin only buttons for non-admins
    if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }

    // Sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('pageTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            const target = link.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active-view');
                view.classList.add('hidden');
                if (view.id === target) {
                    view.classList.remove('hidden');
                    view.classList.add('active-view');
                }
            });

            pageTitle.innerText = link.querySelector('i').nextSibling.textContent.trim();
            loadDataForView(target);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Load initial dashboard data
    loadDashboardData();
    setupModals();
});

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function showLoading(tbodyId, colSpan = 5) {
    const tbody = document.getElementById(tbodyId);
    if (tbody) tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center;padding:30px;color:#8b949e;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;margin-bottom:10px;display:block;color:#00ff88;"></i>Loading data...</td></tr>`;
}

function showEmpty(tbodyId, msg, colSpan = 5) {
    const tbody = document.getElementById(tbodyId);
    if (tbody) tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center;padding:30px;color:#8b949e;"><i class="fas fa-inbox" style="font-size:2rem;margin-bottom:10px;display:block;"></i>${msg}</td></tr>`;
}

function loadDataForView(viewId) {
    if (viewId === 'dashboard-view') loadDashboardData();
    else if (viewId === 'players-view') fetchPlayers();
    else if (viewId === 'tournaments-view') fetchTournaments();
    else if (viewId === 'fixtures-view') fetchFixtures();
    else if (viewId === 'grounds-view') fetchGrounds();
}

async function loadDashboardData() {
    try {
        const [pRes, tRes, fRes] = await Promise.all([
            fetch(`${API_URL}/players`, { headers: getHeaders() }),
            fetch(`${API_URL}/tournaments`, { headers: getHeaders() }),
            fetch(`${API_URL}/fixtures`, { headers: getHeaders() })
        ]);
        const players = await pRes.json();
        const tournaments = await tRes.json();
        const fixtures = await fRes.json();

        document.getElementById('statPlayers').innerText = Array.isArray(players) ? players.length : 0;
        document.getElementById('statTournaments').innerText = Array.isArray(tournaments) ? tournaments.length : 0;
        document.getElementById('statFixtures').innerText = Array.isArray(fixtures) ? fixtures.length : 0;
    } catch (err) {
        console.error('Error loading dashboard stats:', err);
        document.getElementById('statPlayers').innerText = '–';
        document.getElementById('statTournaments').innerText = '–';
        document.getElementById('statFixtures').innerText = '–';
    }
}

async function fetchPlayers() {
    showLoading('playersTableBody', 5);
    try {
        const res = await fetch(`${API_URL}/players`, { headers: getHeaders() });
        const players = await res.json();
        const tbody = document.getElementById('playersTableBody');
        if (!Array.isArray(players) || players.length === 0) {
            return showEmpty('playersTableBody', 'No players found. Add one using the + button.', 5);
        }
        tbody.innerHTML = '';
        players.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td><span class="badge pos-${p.position?.toLowerCase()}">${p.position}</span></td>
                <td>⚽ ${p.goals} &nbsp; <small style="color:#8b949e">A: ${p.assists}</small></td>
                <td>
                    ${user.role === 'admin' ? `<i class="fas fa-trash action-icon delete" title="Delete" onclick="deletePlayer('${p._id}')"></i>` : '–'}
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showEmpty('playersTableBody', 'Could not load players. Server may be waking up, try again in 30s.', 5);
        console.error(err);
    }
}

async function fetchTournaments() {
    showLoading('tournamentsTableBody', 5);
    try {
        const res = await fetch(`${API_URL}/tournaments`, { headers: getHeaders() });
        const tournaments = await res.json();
        const tbody = document.getElementById('tournamentsTableBody');
        if (!Array.isArray(tournaments) || tournaments.length === 0) {
            return showEmpty('tournamentsTableBody', 'No tournaments yet. Create one using the + button.', 5);
        }
        tbody.innerHTML = '';
        tournaments.forEach(t => {
            const startDate = new Date(t.startDate).toLocaleDateString('en-IN');
            const endDate = new Date(t.endDate).toLocaleDateString('en-IN');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.name}</strong></td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td style="color:#00ff88;">₹${Number(t.entryFee).toLocaleString('en-IN')}</td>
                <td style="color:#ffd700;">₹${Number(t.prizeMoney).toLocaleString('en-IN')}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showEmpty('tournamentsTableBody', 'Could not load tournaments. Try again in 30s.', 5);
        console.error(err);
    }
}

async function fetchFixtures() {
    showLoading('fixturesTableBody', 5);
    try {
        const res = await fetch(`${API_URL}/fixtures`, { headers: getHeaders() });
        const fixtures = await res.json();
        const tbody = document.getElementById('fixturesTableBody');
        if (!Array.isArray(fixtures) || fixtures.length === 0) {
            return showEmpty('fixturesTableBody', 'No fixtures yet. Generate fixtures from a tournament.', 5);
        }
        tbody.innerHTML = '';
        fixtures.forEach(f => {
            const date = new Date(f.matchDate).toLocaleDateString('en-IN');
            const statusColor = f.status === 'completed' ? '#00ff88' : f.status === 'cancelled' ? '#da3633' : '#ffd700';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${f.tournamentId?.name || 'N/A'}</td>
                <td>${f.homeTeam?.name || 'TBD'}</td>
                <td>${f.awayTeam?.name || 'TBD'}</td>
                <td>${date}</td>
                <td style="color:${statusColor};text-transform:capitalize;">${f.status}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showEmpty('fixturesTableBody', 'Could not load fixtures. Try again in 30s.', 5);
        console.error(err);
    }
}

async function fetchGrounds() {
    showLoading('groundsTableBody', 4);
    try {
        const res = await fetch(`${API_URL}/grounds`, { headers: getHeaders() });
        const grounds = await res.json();
        const tbody = document.getElementById('groundsTableBody');
        if (!Array.isArray(grounds) || grounds.length === 0) {
            return showEmpty('groundsTableBody', 'No grounds found. Add one using the + button.', 4);
        }
        tbody.innerHTML = '';
        grounds.forEach(g => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${g.name}</strong></td>
                <td><i class="fas fa-map-marker-alt" style="color:#00ff88;margin-right:6px;"></i>${g.location}</td>
                <td>${Number(g.capacity).toLocaleString('en-IN')}</td>
                <td style="color:#00ff88;">₹${Number(g.rentPerMatch).toLocaleString('en-IN')}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showEmpty('groundsTableBody', 'Could not load grounds. Try again in 30s.', 4);
        console.error(err);
    }
}

async function deletePlayer(id) {
    if (confirm('Are you sure you want to delete this player?')) {
        try {
            const res = await fetch(`${API_URL}/players/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) {
                fetchPlayers();
                loadDashboardData();
            }
        } catch (err) { console.error(err); }
    }
}

function setupModals() {
    const playerModal = document.getElementById('addPlayerModal');
    const closePlayerModal = document.getElementById('closePlayerModal');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const addPlayerForm = document.getElementById('addPlayerForm');

    if (addPlayerBtn) addPlayerBtn.addEventListener('click', () => playerModal.classList.add('show'));
    if (closePlayerModal) closePlayerModal.addEventListener('click', () => playerModal.classList.remove('show'));

    if (addPlayerForm) {
        addPlayerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('playerName').value;
            const age = document.getElementById('playerAge').value;
            const position = document.getElementById('playerPosition').value;
            try {
                const res = await fetch(`${API_URL}/players`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ name, age, position })
                });
                if (res.ok) {
                    playerModal.classList.remove('show');
                    addPlayerForm.reset();
                    fetchPlayers();
                    loadDashboardData();
                } else {
                    alert('Failed to add player');
                }
            } catch (err) { console.error(err); }
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === playerModal) playerModal.classList.remove('show');
    });
}
