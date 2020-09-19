
const messageForm = document.querySelector("#message-form")
const messageInput = document.querySelector("#message")
const sendBtn = document.querySelector("#send-message")
const messageList = document.querySelector("#message-list")
const userList = document.querySelector("#user-list")

const messageTemp = document.querySelector("#message-template").innerHTML
const userListTemp = document.querySelector("#user-list-template").innerHTML

const socket = io()

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

const cbAck = (data)=>{
    console.log('server received ack', data)
}

socket.emit('testAck', 'send ack from client to server', cbAck)

socket.on('message-from-server', ({username, message, createdAt})=>{
    const html = Mustache.render(messageTemp,{ username, message, createdAt })
    messageList.insertAdjacentHTML('beforeend', html)
})

socket.on('room-data', ({room, users})=>{
    const html = Mustache.render(userListTemp,{ room, users })
    userList.innerHTML = html
})

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendBtn.disabled = true
    socket.emit('message-from-client', e.target.message.value, (error)=>{
        if(!error){
            sendBtn.disabled = false
            messageInput.value = ""
            messageInput.focus()
        }
    })
})
