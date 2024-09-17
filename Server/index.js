const io = require('socket.io')(8000, {
    cors: {
        origin: "*",  // Allow all origins, modify this for specific domains in production
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    // When a new user joins the chat
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // When a user sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects from the chat
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
