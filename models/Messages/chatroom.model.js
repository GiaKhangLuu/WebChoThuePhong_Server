var mongoose = require('mongoose');
var Message = require('./message.model')
var today = new Date();
var chatRoomSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    creatDate: Date
})

var ChatRoom = mongoose.model('ChatRoom', chatRoomSchema, 'ChatRoom')

module.exports.FindAllRoomsOfUser = async userId => {
    try {
        const rooms = await ChatRoom.
            find({ 'members': mongoose.Types.ObjectId(userId) })
        /*
        const rooms = await ChatRoom.
            find({ 'members': mongoose.Types.ObjectId(userId) }).
            populate({ 
                pat: 'members', 
                match: { _id: { $ne: mongoose.Types.ObjectId(userId) } },
                select: '_id infor'
            })
        */
        return rooms;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports.FindUserInforOfAllRooms = async userId => {
    try {
        // Get all rooms of user
        var rooms = await this.FindAllRoomsOfUser(userId)


        // Put all roomId in array to filter
        const arrExp = [];
        for(const room of rooms) {
            const _id = room._id.toString();
            const expression =  { id_room: mongoose.Types.ObjectId(_id) } ;
            arrExp.push(expression);
        }

        rooms =  await Message.GetRoomIdSortByLastMessageTime(arrExp) 

        var rs = []

        for(var room of rooms) {
            var room_id = room._id
            var lastMessageTime = room.lastMessageTime

            var room_info = await ChatRoom.
                findById(room_id).
                populate({ 
                    path: 'members', 
                    match: { _id: { $ne: mongoose.Types.ObjectId(userId) } },
                    select: '_id infor local.username'
                })

            var last_message = await Message.FindMessageByTime(room_id, lastMessageTime)

            rs.push({ 'room_info': room_info, 
                      'last_message_time': lastMessageTime,
                      'last_message': last_message})
        } 

        return rs

    } catch(err) {
        console.log(err)
        return null
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

const GetMemberInRoom = async(user_id, room) => {
    const member_id = await room.filter(id => id != user_id)
    return member_id[0]
}

module.exports.UnreadMessageCount = async (user_id) => {
    try {

        // Get all rooms of user
        var rooms = await this.FindAllRoomsOfUser(user_id)

        // Put all roomId in array to filter
        const arrExp = [];
        for(const room of rooms) {
            const _id = room._id.toString();
            const room_expression =  { id_room: mongoose.Types.ObjectId(_id) } ;

            const member_id = await GetMemberInRoom(user_id, room.members)
            const member_expression = { id_sender: member_id.toString() };

            const exp = { $and: [member_expression, room_expression] }
            arrExp.push(exp);
        }

        rooms =  await Message.GetUnreadMessageInRoom(arrExp) 

        return rooms.length
    } catch(err) {
        console.log(err)
        return null
    }
}
