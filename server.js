const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Rotas
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/chat.html");
    })

server.listen(3000, () => {
    console.log('Server rodando!');
});