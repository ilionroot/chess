const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const db = require('./models/db');

// Configs
    app.use(express.static(path.join(__dirname, "/public")))
// Rotas
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + "/public/pages/register.html")
    })

    app.post('/register', (req, res) => {
        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;
        var senhac = req.body.senhac;

        if(senha === senhac) {

        } else {
            res.sendFile(__dirname + "/public/pages/errors/passwords.html");
        }
    })

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + "/public/pages/login.html");
    })

    let messages = [];

    io.on('connection', socket => {

        socket.emit('previousMessages', messages);

        socket.on('sendMessage', function(data) {
            messages.push(data);

            socket.broadcast.emit('receivedMessage', data);
        });

        socket.on('disconnect', function() {
            console.log('user ' + socket.id + " desconectado!");
        });
    })

    app.post('/', (req, res) => {

    })

server.listen(3000, () => {
    console.log('Server rodando!');
});