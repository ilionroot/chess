const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const db = require('./models/db');

// Configs
    app.use(express.static(path.join(__dirname, "/public")))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
// Rotas
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + "/public/pages/register.html")
    })

    app.post('/register', async (req, res) => {
        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;

        if(senha === req.body.senhac) {
            db.getConnection(err => { if(err) throw err; })

            db.query("SELECT user_id FROM users WHERE user_email = (?)", [email], (err, result, fields) => {
                if( err ) { throw err; }
                if( result ) { return result; }
            })

            var Senha = await bcrypt.hash(senha,10);

            var user = {
                user_name: nome,
                user_email: email,
                user_password: Senha
            }

            db.query("INSERT INTO users SET ?", [user], (err, result, fields) => {
                if ( err ) { throw err; }
                else { res.send("CADASTRADO COM SUCESSO!<br><a href='/'>Click to back!</a>"); }
            })

            db.releaseConnection();
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
        })
    })

    app.get('/chat', (req, res) => {
        res.sendFile(__dirname + "/chat.html");
    })

server.listen(3000, () => {
    console.log('Server rodando!');
});