const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room})=>{
    username = username.toString().trim().toLowerCase()
    room = room.toString().trim().toLowerCase()

    if(!username || !room){
        return {
            error: "Username and room are required!"
        }
    }

    const existingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })
    if(existingUser){
        return {
            error: "Username is in use!"
        }
    }
    const userInput = {id, username, room}
    users.push(userInput)

    return {user: userInput}
}

const removeUser = (id)=>{
    const index = users.findIndex(user => user.id == id)
    if(index != -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
    return users.find(user => user.id==id)
}

const getUsersInRoom = (room)=>{
    room = room.toString().trim().toLowerCase()
    return users.filter(user => user.room == room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
