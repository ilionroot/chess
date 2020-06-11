const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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
        app.use(cookieParser());

        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'senha'
        }, function(username,password,done) {
            console.log(username);

            User.findOne( { where: { user_email: username } }).then(user=>{
                console.log('isso eh um callback');

                if ( !user ) {
                    return done(null, false, { message: 'Incorrect username!' });
                }
    
                if (bcrypt.compareSync(password,user.user_password)) { console.log('Logou!'); return done(false,user, { message: 'Logou!' }) }
                else {
                    console.log('INCORRECT PASSWORD!');
                    return done(null, false, { message: 'Incorrect PASSWORD!' });
                }
            }
            )
            .catch(err=>{ return done(err); })
        }));

        passport.serializeUser((user, done) => {
            done(null, user.user_id);
        })

        passport.deserializeUser((id, done) => {
            User.findOne( {where:{user_id: id}}).then(user=>{
                done(null, user.user_id);
            }).catch(err=>{
                done(err);
            })
        });

        const authenticationMiddleware = (req, res, next) => {  
            if (req.isAuthenticated()) {
                return next();
            }

            res.redirect('/login?fail=true');
        }
    // Session
        app.use(session({ 
            maxAge: 1000 * 60 * 60 *  2,
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }), (req, res, next) => {
            next();
        });
        app.use(passport.initialize());
        app.use(passport.session());

// Rotas
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })
    
    var userC;

    app.get('/chat', authenticationMiddleware, (req, res) => {
        res.sendFile(__dirname + "/public/chat.html");
        userC = req.user;
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + "/public/pages/register.html");
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
    });

    app.get('/login', (req, res) => {
        if(req.query.fail)
            res.sendFile(__dirname + "/public/pages/login.html", { message: 'Usuário e/ou senha incorretos!' });
         else
            res.sendFile(__dirname + "/public/pages/login.html");
    });

    app.post('/login/', passport.authenticate('local', { failureRedirect: '/login?fail=true' }), (req, res) => {
        res.redirect('/');
    })

    let messages = [];

    io.on('connection', socket => {

        if(userC != null) {
            User.findOne({
                where: {
                    user_id: userC
                }
            }).then(data=>{
                socket.emit('apelidoUser', data.user_name);
            }).catch(err=>{
                throw err;
            })
        }

        socket.emit('previousMessages', messages);

        socket.on('sendMessage', function(data) {
            messages.push(data);

            socket.broadcast.emit('receivedMessage', data);
        });

        socket.on('disconnect', function() {
            console.log('user ' + socket.id + " desconectado!");
        })
    });

    app.get('/register/ok', (req, res) => {
        res.sendFile(__dirname + "/public/pages/redirects/rOk.html");
    })

server.listen(3000, () => {
    console.log('Server rodando!');
});