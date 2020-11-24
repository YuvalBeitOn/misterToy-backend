module.exports = connectSockets


function connectSockets(io) {
    var msgs = []
    io.on('connection', socket => {
        socket.emit('msg history', msgs)
        socket.on('user typing', (user) => {
            io.to(socket.myTopic).emit('user typing', user)
        })
        socket.on('chat newMsg', msg => {
            msgs.push(msg)
            io.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('chat topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
    })
}