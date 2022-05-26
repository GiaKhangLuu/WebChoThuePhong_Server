var mongoose = require('mongoose');
var today = new Date();
const cloudinary = require('cloudinary').v2;
const isBase64 = require('is-base64');

var MessageSchema = new mongoose.Schema(
    {
        id_sender:{
            type:String,
            required:true
        },
        message: {
            content: { 
                type: String,
                default: ''
            },
            images: [{
                type: String,
            }],
        },
        status: {
            type: Number,
            require: true,
            default: 0
        },
        time: {
            type: Date,
            require: true,
            default: new Date()
        },
        id_room: {
            type: mongoose.Types.ObjectId,
            require: true
        }
    },{
        versionKey:false
    }
);

var Message = mongoose.model('Message', MessageSchema, 'Message')

module.exports.CreateMessage = async (id_sender, message_content, id_room) => {
    var message = new Message()
    message.id_sender = id_sender
    message.message = message_content
    message.id_room = mongoose.Types.ObjectId(id_room)
    message = await Message.create(message)

    return message
}

module.exports.LoadOldMessages = async (room_id) => {
    const messages = await Message.aggregate([
        // Stage 1 - get all records in room by group roomId
        { $match: { id_room: mongoose.Types.ObjectId(room_id) } },
        // Stage 2 - sort by time
        { $sort: { time: 1 } }
    ]);

    // Seen all messages after loading
    SeenMessage(room_id)

    return messages
}

module.exports.GetRoomIdSortByLastMessageTime = async (room_ids) => {
    const conversations = await Message.aggregate([
        // Stage 1 - get all roomDetails by roomId
        { $match: { $or: room_ids } },
        // Stage 2 - find last message time
        {
            $group: {
                _id: "$id_room",
                lastMessageTime: { $max: "$time" },
            }
        },
        // Stage 3 - sort lastMessageTime descending
        {
            $sort: { lastMessageTime: -1 }
        }
    ] )
    return conversations
}

module.exports.GetUnreadMessageInRoom = async (room_ids) => {
    if (room_ids.length == 0) {
        return []
    }
    const unread_messages = await Message.aggregate([
        // Stage 1 - get all roomDetails by roomId
        { $match: { $or: room_ids } },
        // Stage 2 - find min message_status 
        {
            $group: {
                _id: "$id_room",
                message_status: { $min: "$status" },
            }
        },
        // Stage 3 - clarify message which status = 0
        {
            $match: { message_status: 0 }
        }
    ] )

    return unread_messages
}

const SeenMessage = async (room_id) => {
    try {
        var messages = await Message.update(
            { id_room: mongoose.Types.ObjectId(room_id) },
            { status: 1 },
            { multi: true }
        )
        return messages

    } catch(err) {
        console.log(err)
        return null
    }
}
