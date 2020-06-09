var socket = io('/');

var msg = 0;

function renderMessages(message) {
    $('.messages').append('<div class="message"><strong>' + message.apelido + ': </strong>'+ message.message +'</div>');

    setTimeout(function() {
        $('.message').each(function(i) {
            $(this).css('transform', 'translate3d(0, 0, 0)');
            $(this).css('opacity', 1);
        });
    },50);

    msg++;
}

function scroll(tempo) {
    $(".messages").stop().animate({ scrollTop: $(".messages")[0].scrollHeight}, tempo);
}

socket.on('previousMessages', messages => {
    for (message of messages) {
        renderMessages(message);
    }

    scroll(250);
});

socket.on('receivedMessage', data => {
    renderMessages(data);
    scroll(1000);
});

$('#form').submit(function(event) {
    event.preventDefault();

    var apelido = $('input[name=apelido]').val();
    var message = $('input[name=message]').val();

    if (apelido != "" && message != "") {
        var messageObject = {
            apelido: apelido,
            message: message
        };

        renderMessages(messageObject);

        socket.emit('sendMessage', messageObject);

        $('input[name=message]').val("");
    }

    scroll(1000);
});