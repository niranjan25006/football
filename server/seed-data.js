const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const data = body ? JSON.stringify(body) : null;

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        };

        const req = http.request(options, (res) => {
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

async function seed() {
    console.log('🚮 Starting deep seed of FCMS Pro Data...\n');

    // 1. Admin Login
    let loginRes = await request('POST', '/auth/admin/login', {
        email: 'admin@fcms.com',
        password: 'admin1234'
    });

    if (loginRes.status !== 200) {
        console.log('⚠️ Admin login failed, attempting to register...');
        await request('POST', '/auth/admin/register', {
            username: 'Admin',
            email: 'admin@fcms.com',
            password: 'admin1234'
        });
        loginRes = await request('POST', '/auth/admin/login', {
            email: 'admin@fcms.com',
            password: 'admin1234'
        });
    }

    const token = loginRes.data.token;
    console.log('✅ Authenticated as Admin.');

    // 2. Clear Existing Data (Players, Teams, Tournaments, Grounds, Fixtures)
    console.log('🧹 Clearing existing data...');
    // Players
    const playersRes = await request('GET', '/players', null, token);
    if (Array.isArray(playersRes.data)) {
        for (const p of playersRes.data) await request('DELETE', `/players/${p._id}`, null, token);
    }
    // Teams
    const teamsListRes = await request('GET', '/teams', null, token);
    if (Array.isArray(teamsListRes.data)) {
        for (const t of teamsListRes.data) await request('DELETE', `/teams/${t._id}`, null, token);
    }
    // Grounds
    const groundsRes = await request('GET', '/grounds', null, token);
    if (Array.isArray(groundsRes.data)) {
        for (const g of groundsRes.data) await request('DELETE', `/grounds/${g._id}`, null, token);
    }
    // Tournaments (Note: Seeding script might not have DELETE route for everything, but memory server resets help)
    console.log('✅ Database preparation complete.');

    // 3. Pro Grounds
    const proGrounds = [
        { name: 'Santiago Bernabéu', location: 'Madrid, Spain', capacity: 81044, rentPerMatch: 500000 },
        { name: 'Camp Nou', location: 'Barcelona, Spain', capacity: 99354, rentPerMatch: 450000 },
        { name: 'Wembley Stadium', location: 'London, UK', capacity: 90000, rentPerMatch: 600000 },
        { name: 'Anfield', location: 'Liverpool, UK', capacity: 53394, rentPerMatch: 300000 },
        { name: 'Allianz Arena', location: 'Munich, Germany', capacity: 75000, rentPerMatch: 400000 }
    ];

    console.log('\n🏟️ Adding Pro Grounds...');
    const groundIds = [];
    for (const g of proGrounds) {
        const res = await request('POST', '/grounds', g, token);
        if (res.status === 201) {
            console.log(`   ✅ ${g.name} added.`);
            groundIds.push(res.data._id);
        }
    }

    // 4. Pro Teams
    const proTeams = [
        { name: 'Real Madrid CF', founded: 1902 },
        { name: 'Manchester City', founded: 1880 },
        { name: 'Paris Saint-Germain', founded: 1970 },
        { name: 'FC Bayern Munich', founded: 1900 },
        { name: 'Liverpool FC', founded: 1892 },
        { name: 'FC Barcelona', founded: 1899 }
    ];

    console.log('\n🛡️ Adding Pro Teams...');
    const teamIds = [];
    for (const t of proTeams) {
        const res = await request('POST', '/teams', t, token);
        if (res.status === 201) {
            console.log(`   ✅ ${t.name} added.`);
            teamIds.push(res.data._id);
        }
    }

    // 5. Pro Players (Assign to teams)
    const proPlayers = [
        { name: 'Kylian Mbappé', age: 25, position: 'Forward', number: 7, nationality: 'France', teamId: teamIds[0], image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800', goals: 12 },
        { name: 'Vinícius Júnior', age: 23, position: 'Forward', number: 7, nationality: 'Brazil', teamId: teamIds[0], image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800', goals: 9 },
        { name: 'Erling Haaland', age: 23, position: 'Forward', number: 9, nationality: 'Norway', teamId: teamIds[1], image: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?auto=format&fit=crop&q=80&w=800', goals: 18 },
        { name: 'Kevin De Bruyne', age: 32, position: 'Midfielder', number: 17, nationality: 'Belgium', teamId: teamIds[1], image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800', goals: 5 },
        { name: 'Lionel Messi', age: 36, position: 'Forward', number: 10, nationality: 'Argentina', teamId: teamIds[2], image: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800', goals: 14 },
        { name: 'Harry Kane', age: 30, position: 'Forward', number: 9, nationality: 'England', teamId: teamIds[3], image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800', goals: 15 },
        { name: 'Mohamed Salah', age: 31, position: 'Forward', number: 11, nationality: 'Egypt', teamId: teamIds[4], image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', goals: 13 },
        { name: 'Robert Lewandowski', age: 35, position: 'Forward', number: 9, nationality: 'Poland', teamId: teamIds[5], image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800', goals: 11 }
    ];

    console.log('\n🏃 Adding Pro Players...');
    for (const p of proPlayers) {
        await request('POST', '/players', p, token);
    }
    console.log('   ✅ Pro players added and assigned to teams.');

    // 6. Pro Tournaments
    const proTournaments = [
        { name: 'UEFA Champions League', startDate: '2026-09-01', endDate: '2027-05-30', entryFee: 100000, prizeMoney: 20000000 },
        { name: 'Premier League', startDate: '2026-08-15', endDate: '2027-05-20', entryFee: 50000, prizeMoney: 15000000 }
    ];

    console.log('\n🏆 Adding Pro Tournaments...');
    for (const t of proTournaments) {
        const res = await request('POST', '/tournaments', t, token);
        if (res.status === 201) {
            const tournamentId = res.data._id;
            console.log(`   ✅ ${t.name} added.`);

            // Register teams for the tournament
            console.log(`      Registering teams...`);
            for (const teamId of teamIds) {
                await request('POST', `/tournaments/${tournamentId}/register`, { teamId }, token);
            }

            // Generate fixtures
            console.log(`      Generating match fixtures...`);
            await request('POST', '/fixtures', { tournamentId }, token);
        }
    }

    console.log('\n🚀 DEEP SEED COMPLETE! FCMS is now populated with professional data.');
}

seed().catch(err => console.error('Seeding failed:', err));
