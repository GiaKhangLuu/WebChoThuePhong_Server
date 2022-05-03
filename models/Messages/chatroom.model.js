var mongoose = require('mongoose');
var today = new Date();
var chatRoomSchema = new mongoose.Schema({
    members: Array,
    creatDate: Date
})

var ChatRoom = mongoose.model('ChatRoom', chatRoomSchema, 'ChatRoom')

module.exports.FindAllRoomsOfUser = async userId => {
    try {
        const roomIds = await ChatRoom.find({ "members": mongoose.Types.ObjectId(userId) }) ;
        return roomIds;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports.CreateRoom = async (members) => {
    const processed_members = [];
    for (var member of members) {
        processed_members.push(mongoose.Types.ObjectId(member));
    }
    var room = new ChatRoom();
    room.members = processed_members;
    room.createDate = new Date();
    await ChatRoom.create(room);
    return room;
}

module.exports.FindChatRoom = async (sender_id, receiver_id) => {
    try {
        const roomId = await ChatRoom.aggregate([
            { $match: { $and: [
                { members: mongoose.Types.ObjectId(sender_id) },
                { members: mongoose.Types.ObjectId(receiver_id)}
            ] } },
        ])
        return roomId;
    } catch(err) {
        console.log(err);
        return null;
    }
}

