const http = require('http');

const regData = JSON.stringify({
    username: 'Admin',
    email: 'admin@fcms.com',
    password: 'admin1234'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': regData.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(regData);
req.end();
