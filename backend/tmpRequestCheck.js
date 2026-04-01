const http = require('http');
const data = JSON.stringify({ email: 'test@example.com', password: 'abc' });
const options = {
  method: 'POST',
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/login',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  res.on('data', (chunk) => process.stdout.write(chunk));
  res.on('end', () => {
    console.log('\nEND');
  });
});

req.on('error', (e) => {
  console.error('ERROR', e.message);
});

req.write(data);
req.end();
