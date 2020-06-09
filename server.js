const net = require('net');

const handleConnection = socket => {
    console.log('alguem se conectou');
};

const server = net.createServer(handleConnection);
server.listenerCount(3000, 'localhost');