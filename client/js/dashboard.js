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
                <td class="player-cell">
                    <img src="${p.image || 'https://via.placeholder.com/40'}" class="player-thumb" alt="${p.name}">
                    <div>
                        <div class="player-name-main">${p.name}</div>
                        <small style="color:#8b949e">#${p.number || '--'}</small>
                    </div>
                </td>
                <td>${p.age}</td>
                <td><span class="badge pos-${p.position?.toLowerCase()}">${p.position}</span></td>
                <td>⚽ ${p.goals} &nbsp; <small style="color:#8b949e">A: ${p.assists}</small></td>
                <td>
                    <i class="fas fa-user-circle action-icon view" title="View Profile" onclick="viewPlayerProfile('${p._id}')"></i>
                    ${user.role === 'admin' ? `<i class="fas fa-trash action-icon delete" title="Delete" onclick="deletePlayer('${p._id}')"></i>` : ''}
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
    showLoading('fixturesTableBody', 6);
    try {
        const res = await fetch(`${API_URL}/fixtures`, { headers: getHeaders() });
        const fixtures = await res.json();
        const tbody = document.getElementById('fixturesTableBody');
        if (!Array.isArray(fixtures) || fixtures.length === 0) {
            return showEmpty('fixturesTableBody', 'No fixtures yet. Generate fixtures from a tournament.', 6);
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
                <td>${f.groundId?.name || 'TBD'}</td>
                <td style="color:${statusColor};text-transform:capitalize;">${f.status}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showEmpty('fixturesTableBody', 'Could not load fixtures. Try again in 30s.', 6);
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
    const modals = {
        player: { el: document.getElementById('addPlayerModal'), open: document.getElementById('addPlayerBtn'), close: document.getElementById('closePlayerModal'), form: document.getElementById('addPlayerForm') },
        tour: { el: document.getElementById('addTournamentModal'), open: document.getElementById('addTournamentBtn'), close: document.getElementById('closeTournamentModal'), form: document.getElementById('addTournamentForm') },
        fixture: { el: document.getElementById('addFixtureModal'), open: document.getElementById('generateFixturesBtn'), close: document.getElementById('closeFixtureModal'), form: document.getElementById('generateFixturesForm') },
        ground: { el: document.getElementById('addGroundModal'), open: document.getElementById('addGroundBtn'), close: document.getElementById('closeGroundModal'), form: document.getElementById('addGroundForm') }
    };

    // Generic open/close logic
    Object.values(modals).forEach(m => {
        if (m.open) m.open.addEventListener('click', () => {
            m.el.classList.add('show');
            if (m === modals.fixture) populateTournamentSelect();
        });
        if (m.close) m.close.addEventListener('click', () => m.el.classList.remove('show'));
    });

    if (modals.player.form) {
        // Auto-suggest image based on name
        const nameInput = document.getElementById('playerName');
        const imageInput = document.getElementById('playerImage');

        nameInput.addEventListener('blur', () => {
            if (!imageInput.value) {
                const autoImg = getAutoImage(nameInput.value);
                if (autoImg) imageInput.value = autoImg;
            }
        });

        modals.player.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('playerName').value,
                age: document.getElementById('playerAge').value,
                position: document.getElementById('playerPosition').value,
                number: document.getElementById('playerNumber').value,
                nationality: document.getElementById('playerNationality').value,
                height: document.getElementById('playerHeight').value,
                preferredFoot: document.getElementById('playerFoot').value,
                image: document.getElementById('playerImage').value
            };
            if (await submitForm('/players', payload)) {
                modals.player.el.classList.remove('show');
                modals.player.form.reset();
                fetchPlayers();
                loadDashboardData();
            }
        });
    }

    // Tournaments
    if (modals.tour.form) {
        modals.tour.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('tourName').value,
                startDate: document.getElementById('tourStartDate').value,
                endDate: document.getElementById('tourEndDate').value,
                entryFee: document.getElementById('tourEntryFee').value,
                prizeMoney: document.getElementById('tourPrizeMoney').value
            };
            if (await submitForm('/tournaments', payload)) {
                modals.tour.el.classList.remove('show');
                modals.tour.form.reset();
                fetchTournaments();
                loadDashboardData();
            }
        });
    }

    // Fixtures
    if (modals.fixture.form) {
        modals.fixture.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = { tournamentId: document.getElementById('fixtureTournamentSelect').value };
            if (await submitForm('/fixtures/generate', payload)) {
                modals.fixture.el.classList.remove('show');
                fetchFixtures();
                loadDashboardData();
            }
        });
    }

    // Grounds
    if (modals.ground.form) {
        modals.ground.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('groundName').value,
                location: document.getElementById('groundLocation').value,
                capacity: document.getElementById('groundCapacity').value,
                rentPerMatch: document.getElementById('groundRent').value
            };
            if (await submitForm('/grounds', payload)) {
                modals.ground.el.classList.remove('show');
                modals.ground.form.reset();
                fetchGrounds();
            }
        });
    }

    window.addEventListener('click', (e) => {
        Object.values(modals).forEach(m => { if (e.target === m.el) m.el.classList.remove('show'); });
    });
}

async function submitForm(endpoint, body) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        if (res.ok) return true;
        const err = await res.json();
        alert(err.message || 'Action failed');
    } catch (err) {
        console.error(err);
        alert('Server unreachable');
    }
    return false;
}

async function populateTournamentSelect() {
    const select = document.getElementById('fixtureTournamentSelect');
    select.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
        const res = await fetch(`${API_URL}/tournaments`, { headers: getHeaders() });
        const data = await res.json();
        select.innerHTML = '<option value="" disabled selected>Select a Tournament</option>';
        data.forEach(t => {
            const option = document.createElement('option');
            option.value = t._id;
            option.textContent = t.name;
            select.appendChild(option);
        });
    } catch (err) { console.error(err); }
}

function viewPlayerProfile(id) {
    window.location.href = `player-profile.html?id=${id}`;
}

function getAutoImage(name) {
    const n = name.toLowerCase();
    if (n.includes('mbappe')) return 'assets/images/players/mbappe.png';
    if (n.includes('messi')) return 'assets/images/players/messi.png';
    if (n.includes('ronaldo')) return 'assets/images/players/ronaldo.png';
    if (n.includes('neymar')) return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800';
    return '';
}
