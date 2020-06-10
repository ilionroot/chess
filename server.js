const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Configs
        app.use(express.static(path.join(__dirname, "/public")))
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

    // Passport
        passport.use(new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
            console.log('Inside local strategy callback')
            // here is where you make a call to the database
            // to find the user based on their username or email address
            // for now, we'll just pretend we found that it was users[0]
            if(email === ('conexao-com-o-banco') && password === ('conexao-com-o-banco')) {
                console.log('Local strategy returned true')
                return done(null, user)
            }
            }
        ));

        passport.serializeUser((user, done) => {
            console.log('Inside serializeUser callback. User id is save to the session file store here')
            done(null, user.id);
          });

        passport.deserializeUser((id, done) => {
            console.log('Inside deserializeUser callback')
            console.log(`The user id passport saved in the session file store is: ${id}`)
            const user = users[0].id === id ? users[0] : false; 
            done(null, user);
        });
    // Session
        app.use(session({
            genid: (req) => {
                console.log('Inside the session middleware')
                console.log(req.sessionID)
                return uuid.v4(); // use UUIDs for session IDs
            },
            store: new FileStore(),
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }))

        app.use(passport.initialize());
        app.use(passport.session());
// Rotas
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })
    
    app.get('/chat', (req, res) => {
        res.sendFile(__dirname + "/public/chat.html");
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + "/public/pages/register.html")
    });

    app.post('/register', (req, res) => {
        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;

        if(senha === req.body.senhac) {
            User.findOne({
                where: {
                    user_email: email
                }
            }).then(async result => {
                if(!result) {
                    senha = await bcrypt.hash(senha, 10);

                    User.create({
                        user_name: nome,
                        user_email: email,
                        user_password: senha
                    }).then(()=>{
                        res.send("Cadastrado com sucesso!<br><a href='/'>Click to back!</a>");
                    }).catch(err=>{
                        throw err;
                    })
                } else {
                    res.send("E-MAIL JA CADASTRADO!<br><a href='/register'>Click to back!</a>");
                }
            }).catch(err => {
                throw err;
            })
        } else {
            res.sendFile(__dirname + "/public/pages/errors/passwords.html");
        }
    })

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + "/public/pages/login.html");
    });

    app.post('/login', (req, res) => {
        var email = req.body.email;
        var senha = req.body.senha;

        User.findOne({
            where: {
                user_email: email
            }
        }).then(result=>{
            if(result && bcrypt.compareSync(senha , result.user_password)) {
                res.send("You have been logged!<a href='/'>Click to back to menu!</a>");
            } else {
                res.send("User does not EXISTS<br><a href'/login'>Click to go to MENU!</a>");
            }
        }).catch(err=>{
            throw err;
        })

        passport.authenticate('local', (err, user, info) => {
            console.log('Inside passport.authenticate() callback');
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            req.login(user, (err) => {
              console.log('Inside req.login() callback')
              console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
              console.log(`req.user: ${JSON.stringify(req.user)}`)
              return res.send('You were authenticated & logged in!\n');
            })
        })(req, res, next);
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
    });

    app.get('/chat', (req, res) => {
        res.sendFile(__dirname + "/chat.html");
    })

    app.get('/register/ok', (req, res) => {
        res.sendFile(__dirname + "/public/pages/redirects/rOk.html");
    })

server.listen(3000, () => {
    console.log('Server rodando!');
});