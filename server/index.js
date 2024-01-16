const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    // Solicitar al cliente que ingrese su nombre de usuario
    socket.emit('solicitar_usuario');

    socket.on('usuario', (usuario) => {
        socket.broadcast.emit('chat_message', {
            usuario: 'INFO',
            mensaje: `${usuario} se ha conectado`
        });

        socket.on('chat_message', (data) => {
            io.emit('chat_message', data);
        });
    });
});

server.listen(3000);
