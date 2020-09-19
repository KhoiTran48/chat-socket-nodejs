
// socket.emit, io.emit, socket.broadcast.emit
// io.to.emit, socket.broadcast.to.emit

const path = require('path')
const moment = require('moment')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT | 3000
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))

io.on('connection', (socket)=>{
    console.log('New Websocket connection')

    socket.on('join', ({username, room}, cb)=>{

        const {error, user} = addUser({id: socket.id, username, room})
        if(error){
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('message-from-server', {username: 'Admin', message: `Welcome ${user.username}`, createdAt: moment().format('h:mm a')})

        socket.broadcast.to(user.room).emit('message-from-server', {username: 'Admin', message: `${user.username} has joined`, createdAt: moment().format('h:mm a')})

        io.to(user.room).emit('room-data', {room: user.room, users: getUsersInRoom(user.room)})
        
        return cb()
    })
    
    socket.on('message-from-client', (message, cb)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('message-from-server', {username: user.username,message, createdAt: moment().format('h:mm a')})
            cb()
        }
        cb('no user')
    })
    socket.on('testAck', (message, cb)=>{
        cb()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message-from-server', {username: 'Admin', message: `${user.username} has left`, createdAt: moment().format('h:mm a')})

            io.to(user.room).emit('room-data', {room: user.room, users: getUsersInRoom(user.room)})
        }
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})
