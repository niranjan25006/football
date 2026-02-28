const https = require('https');
const http = require('http');

const BASE_URL = 'https://football-mf27.onrender.com/api';

function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const isHttps = url.protocol === 'https:';
        const lib = isHttps ? https : http;
        const data = body ? JSON.stringify(body) : null;

        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        };

        const req = lib.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(responseData) });
                } catch {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function refresh() {
    console.log('🚮 Clearing and seeding pro players...\n');

    // 1. Admin Login
    const loginRes = await request('POST', '/auth/admin/login', {
        email: 'admin@fcms.com',
        password: 'admin1234'
    });

    if (loginRes.status !== 200) {
        console.error('❌ Admin login failed. Check credentials.');
        return;
    }
    const token = loginRes.data.token;
    console.log('✅ Admin Authenticated.');

    // 2. Fetch all players
    const playersRes = await request('GET', '/players', null, token);
    const existingPlayers = playersRes.data || [];
    console.log(`🧹 Removing ${existingPlayers.length} existing players...`);

    for (const p of existingPlayers) {
        await request('DELETE', `/players/${p._id}`, null, token);
    }
    console.log('✅ Database cleared.');

    // 3. Add Pro Players
    const proPlayers = [
        { name: 'Kylian Mbappé', age: 25, position: 'Forward', number: 7, height: '1.78m', preferredFoot: 'Right', nationality: 'France', image: 'assets/images/players/mbappe.png', goals: 12, assists: 5, matchesPlayed: 20 },
        { name: 'Lionel Messi', age: 36, position: 'Forward', number: 10, height: '1.70m', preferredFoot: 'Left', nationality: 'Argentina', image: 'assets/images/players/messi.png', goals: 14, assists: 11, matchesPlayed: 19 },
        { name: 'Cristiano Ronaldo', age: 39, position: 'Forward', number: 7, height: '1.87m', preferredFoot: 'Right', nationality: 'Portugal', image: 'assets/images/players/ronaldo.png', goals: 15, assists: 3, matchesPlayed: 21 },
        { name: 'Erling Haaland', age: 23, position: 'Forward', number: 9, height: '1.94m', preferredFoot: 'Left', nationality: 'Norway', image: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?auto=format&fit=crop&q=80&w=800', goals: 18, assists: 2, matchesPlayed: 22 },
        { name: 'Kevin De Bruyne', age: 32, position: 'Midfielder', number: 17, height: '1.81m', preferredFoot: 'Right', nationality: 'Belgium', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800', goals: 5, assists: 15, matchesPlayed: 18 },
        { name: 'Mohamed Salah', age: 31, position: 'Forward', number: 11, height: '1.75m', preferredFoot: 'Left', nationality: 'Egypt', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', goals: 13, assists: 7, matchesPlayed: 20 },
        { name: 'Neymar Jr', age: 32, position: 'Forward', number: 10, height: '1.75m', preferredFoot: 'Right', nationality: 'Brazil', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800', goals: 10, assists: 9, matchesPlayed: 15 },
        { name: 'Virgil van Dijk', age: 32, position: 'Defender', number: 4, height: '1.93m', preferredFoot: 'Right', nationality: 'Netherlands', image: 'https://images.unsplash.com/photo-1518005020250-68a0d0d75b17?auto=format&fit=crop&q=80&w=800', goals: 2, assists: 1, matchesPlayed: 24 },
        { name: 'Luka Modric', age: 38, position: 'Midfielder', number: 10, height: '1.72m', preferredFoot: 'Right', nationality: 'Croatia', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', goals: 3, assists: 8, matchesPlayed: 19 },
        { name: 'Manuel Neuer', age: 37, position: 'Goalkeeper', number: 1, height: '1.93m', preferredFoot: 'Right', nationality: 'Germany', image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?auto=format&fit=crop&q=80&w=800', goals: 0, assists: 0, matchesPlayed: 25 }
    ];

    console.log('\n🌟 Adding Pro Players...');
    for (const p of proPlayers) {
        const res = await request('POST', '/players', p, token);
        if (res.status === 201) {
            console.log(`   ✅ ${p.name} added successfully.`);
        } else {
            console.log(`   ❌ Failed to add ${p.name}:`, res.data.message);
        }
    }

    console.log('\n🚀 Refresh Complete! Pro stars are now on the field.');
}

refresh().catch(console.error);
