const https = require('https');
const http = require('http');

const BASE_URL = 'https://football-mf27.onrender.com/api';

// Helper to make HTTP requests
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

async function seed() {
    console.log('🌱 Starting seed...\n');

    // 1. Register Admin
    console.log('1️⃣  Registering admin...');
    const adminRes = await request('POST', '/auth/admin/register', {
        username: 'superadmin',
        email: 'admin@fcms.com',
        password: 'admin1234'
    });
    let token;
    if (adminRes.status === 201) {
        token = adminRes.data.token;
        console.log('   ✅ Admin created: admin@fcms.com / admin1234');
    } else if (adminRes.status === 400 && adminRes.data.message?.includes('already')) {
        // Already exists, just login
        const loginRes = await request('POST', '/auth/admin/login', {
            email: 'admin@fcms.com',
            password: 'admin1234'
        });
        token = loginRes.data.token;
        console.log('   ✅ Admin already exists, logged in');
    } else {
        console.log('   ❌ Admin error:', adminRes.data);
        return;
    }

    // 2. Register Users
    console.log('\n2️⃣  Registering users...');
    const users = [
        { username: 'manager_united', email: 'united@fcms.com', password: 'pass1234' },
        { username: 'manager_city', email: 'city@fcms.com', password: 'pass1234' },
        { username: 'manager_rovers', email: 'rovers@fcms.com', password: 'pass1234' },
    ];
    const userTokens = [];
    for (const u of users) {
        const r = await request('POST', '/auth/register', u);
        if (r.status === 201) {
            userTokens.push(r.data.token);
            console.log(`   ✅ User created: ${u.email}`);
        } else {
            console.log(`   ⚠️  User ${u.email}: ${r.data.message}`);
        }
    }

    // 3. Add Players
    console.log('\n3️⃣  Adding players...');
    const players = [
        { name: 'Rajesh Kumar', age: 24, position: 'Forward', goals: 12, assists: 5, matchesPlayed: 20 },
        { name: 'Arjun Sharma', age: 22, position: 'Midfielder', goals: 7, assists: 9, matchesPlayed: 18 },
        { name: 'Suresh Patel', age: 26, position: 'Defender', goals: 1, assists: 3, matchesPlayed: 22 },
        { name: 'Vikram Singh', age: 28, position: 'Goalkeeper', goals: 0, assists: 0, matchesPlayed: 22 },
        { name: 'Karthik Rajan', age: 23, position: 'Forward', goals: 9, assists: 4, matchesPlayed: 17 },
        { name: 'Anand Verma', age: 25, position: 'Midfielder', goals: 5, assists: 11, matchesPlayed: 19 },
        { name: 'Deepak Nair', age: 21, position: 'Forward', goals: 14, assists: 6, matchesPlayed: 20 },
        { name: 'Manoj Reddy', age: 27, position: 'Defender', goals: 2, assists: 1, matchesPlayed: 21 },
        { name: 'Pradeep Iyer', age: 24, position: 'Midfielder', goals: 3, assists: 8, matchesPlayed: 16 },
        { name: 'Rahul Menon', age: 22, position: 'Goalkeeper', goals: 0, assists: 0, matchesPlayed: 15 },
    ];
    for (const p of players) {
        const r = await request('POST', '/players', p, token);
        if (r.status === 201) {
            console.log(`   ✅ Player added: ${p.name} (${p.position})`);
        } else {
            console.log(`   ❌ Player error for ${p.name}:`, r.data.message);
        }
    }

    // 4. Add Grounds
    console.log('\n4️⃣  Adding grounds...');
    const grounds = [
        { name: 'Jawaharlal Nehru Stadium', location: 'Chennai, Tamil Nadu', capacity: 40000, rentPerMatch: 50000 },
        { name: 'Salt Lake Stadium', location: 'Kolkata, West Bengal', capacity: 85000, rentPerMatch: 75000 },
        { name: 'Sree Kanteerava', location: 'Bengaluru, Karnataka', capacity: 24000, rentPerMatch: 40000 },
        { name: 'Mumbai Football Arena', location: 'Mumbai, Maharashtra', capacity: 8000, rentPerMatch: 30000 },
    ];
    const groundIds = [];
    for (const g of grounds) {
        const r = await request('POST', '/grounds', g, token);
        if (r.status === 201) {
            groundIds.push(r.data._id);
            console.log(`   ✅ Ground added: ${g.name}`);
        } else {
            console.log(`   ❌ Ground error:`, r.data.message);
        }
    }

    // 5. Create Tournaments
    console.log('\n5️⃣  Creating tournaments...');
    const tournaments = [
        {
            name: 'State Championship 2026',
            startDate: '2026-03-01',
            endDate: '2026-04-30',
            entryFee: 10000,
            prizeMoney: 200000
        },
        {
            name: 'District Cup 2026',
            startDate: '2026-05-01',
            endDate: '2026-05-31',
            entryFee: 5000,
            prizeMoney: 100000
        },
        {
            name: 'Inter-College Football League',
            startDate: '2026-06-01',
            endDate: '2026-07-15',
            entryFee: 2000,
            prizeMoney: 50000
        }
    ];
    const tournamentIds = [];
    for (const t of tournaments) {
        const r = await request('POST', '/tournaments', t, token);
        if (r.status === 201) {
            tournamentIds.push(r.data._id);
            console.log(`   ✅ Tournament created: ${t.name}`);
        } else {
            console.log(`   ❌ Tournament error:`, r.data.message);
        }
    }

    // 6. Verify all data
    console.log('\n📊 Verifying data...');
    const pCount = await request('GET', '/players', null, token);
    const tCount = await request('GET', '/tournaments', null, token);
    const gCount = await request('GET', '/grounds', null, token);

    console.log(`   Players  : ${pCount.data.length}`);
    console.log(`   Tournaments: ${tCount.data.length}`);
    console.log(`   Grounds  : ${gCount.data.length}`);

    console.log('\n✅ Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email   : admin@fcms.com');
    console.log('   Password: admin1234');
    console.log('   Role    : Admin (check "Login as Admin")');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seed().catch(err => console.error('❌ Seed failed:', err.message));
