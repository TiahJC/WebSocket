const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

// Load SSL/TLS certificates
const serverOptions = {
    key: fs.readFileSync('../SysB.key'),
    cert: fs.readFileSync('../SysB.pem'),
    ca: fs.readFileSync('../RootCA.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

// Create HTTPS server
const server = https.createServer(serverOptions);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('WebSocket server running on ws://localhost:8080');
});
