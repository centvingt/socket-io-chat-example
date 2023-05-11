const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

io.on('connection', socket => {
    console.log('connection')
    socket.emit('chat message', {from: 'serveur', msg: 'Bienvenue'})
    socket.broadcast.emit('chat message', {from: 'serveur', msg: 'Un nouvel utilisateur est connecté'})
    socket.on('chat message', obj => {
        const { token, msg } = obj
        console.log('token: ', token)
        socket.emit('chat message', { from: 'vous', msg })
        socket.broadcast.emit('chat message', { from: 'autre', msg })
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.broadcast.emit('chat message', {from: 'serveur', msg: 'Un utilisateur est déconnecté'})
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})