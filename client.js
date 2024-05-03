const readline = require('readline');
const WebSocket = require('ws');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket('wss://localhost:8080', {
    ca: '../RootCA.pem', // Replace '../RootCA.pem' with the path to your CA certificate
    rejectUnauthorized: false
});

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
    if (typeof data === 'string') {
        // If the message is a string, treat it as text
        console.log('Received message:', data);
    } else if (data instanceof Buffer) {
        // If the message is a Buffer, convert it to text
        console.log('Received message:', data.toString('utf8'));
    } else {
        console.error('Received message of unexpected type:', data);
    }
});


ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    } else {
        console.error('WebSocket connection is not open');
    }
}

// Listen for input from the console
rl.on('line', (input) => {
    sendMessage(input); // Send the input message to the WebSocket server
});
