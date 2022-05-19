var User = require('../models/User/user.model')
var ChatRoom = require('../models/Messages/chatroom.model')
var Message = require('../models/Messages/message.model')

// Get all rooms of user
const FetchRooms = async userId => {
    const rooms = await ChatRoom.FindAllRoomsOfUser(userId);
    return rooms;
}

// Each socket joins to room by roomId
module.exports.JoinRooms = async (socket, data) => {
    const userId = data.user_id
    const rooms = await FetchRooms(userId);
    console.log(rooms)
    // Join rooms
    rooms.forEach(room => {
        socket.join(`room: ${ room._id }` );
    });
}

// Handle user sends message
module.exports.ReceiveMessage = async (io, data) => {
    var receiver_id = data.IdReceiver
    var sender_id = data.IdSender
    var message = data.message
    
    var rooms = await ChatRoom.FindChatRoom(sender_id, receiver_id)  
    var room_id

    // Sender and receiver havent chatted => create new room 
    if (rooms.length == 0) {
        var room = await ChatRoom.CreateRoom([receiver_id, sender_id])
        room_id = room._id
        // Add user to chat room
        await AddUsersToNewRoom(io, room_id, receiver_id, sender_id)

        const sockets = await io.in(`room: ${room_id}`).fetchSockets();

    } else {
        room_id = rooms[0]._id
    }

    // Create message
    Message.CreateMessage(sender_id, message, room_id)

    io.to(`room: ${ room_id }` ).emit('renderMessage', {
        message: message,
        id_receiver: receiver_id,
        id_sender: sender_id
    })
}

// Set socket's name by userId
module.exports.SetSocketName = async (socket, data) => {
    var userId = data.user_id
    socket.name = userId;
}

const AddUsersToNewRoom = async (io, room_id, receiver_id, sender_id) => {
    const room = `room: ${ room_id }`;
    const sockets = await io.fetchSockets();
    sockets.forEach(socket => {
      if (socket.name == receiver_id || socket.name == sender_id) {
            socket.join(room)
      }
    })
}
