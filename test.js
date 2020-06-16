const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let code = [];

app.get('/codding', (req, res) => {
    res.sendFile(__dirname + "/public/pages/codding.html");
});

io.on('connection', socket=>{
    console.log('Usuario ' + socket.id + " conectou!");
    
    socket.on('sendCode', data => {
        code.push(data.text);
        console.log(data.text);
        socket.broadcast.emit('receivedCode', code);
    });
})

server.listen(4000, function(){
    console.log('rodando!');
});