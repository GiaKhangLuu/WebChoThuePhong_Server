var ChatRoom = require("../models/Messages/chatroom.model");
var Message = require("../models/Messages/message.model");
const cloudinary = require("cloudinary").v2;
const isBase64 = require("is-base64");

// Get all rooms of user
const FetchRooms = async (userId) => {
  const rooms = await ChatRoom.FindAllRoomsOfUser(userId);
  return rooms;
};

// Each socket joins to room by roomId
module.exports.JoinRooms = async (socket, data) => {
  const userId = data.user_id;
  const rooms = await FetchRooms(userId);
  // Join rooms
  rooms.forEach((room) => {
    socket.join(`room: ${room._id}`);
  });
};

// Handle user sends message
module.exports.ReceiveMessage = async (io, data) => {
  var receiver_id = data.IdReceiver;
  var sender_id = data.IdSender;
  var message = data.message;

  /*
    if (receiver_id == '' || receiver_id == null) {
        return
    } 
    */

  /*if (message.images.length == 0 && 
        message.content == '') {
        return 
    } else {*/
  var rooms = await ChatRoom.FindChatRoom(sender_id, receiver_id);
  var room_id;

  // Sender and receiver havent chatted => create new room
  if (rooms.length == 0) {
    var room = await ChatRoom.CreateRoom([receiver_id, sender_id]);
    room_id = room._id;
    // Add user to chat room
    await AddUsersToNewRoom(io, room_id, receiver_id, sender_id);

    const sockets = await io.in(`room: ${room_id}`).fetchSockets();
  } else {
    room_id = rooms[0]._id;
  }

  // Handle image message
  var image_urls = await HandleMessageImage(message.images);
  message.images = image_urls;

  // Create message
  Message.CreateMessage(sender_id, message, room_id);
  io.to(`room: ${room_id}`).emit("renderMessage", {
    message: message,
    id_receiver: receiver_id,
    id_sender: sender_id,
  });

  // Send notification
  var unread_message_count = await ChatRoom.UnreadMessageCount(receiver_id);
  io.to(`room: ${room_id}`).emit("notifyMessage", {
    unread_message_count: unread_message_count,
  });
  //}
};

// Set socket's name by userId
module.exports.SetSocketName = async (socket, data) => {
  var userId = data.user_id;
  socket.name = userId;
};

const AddUsersToNewRoom = async (io, room_id, receiver_id, sender_id) => {
  try {
    const room = `room: ${room_id}`;
    const sockets = await io.fetchSockets();
    sockets.forEach((socket) => {
      if (socket.name == receiver_id || socket.name == sender_id) {
        socket.join(room);
      }
    });
  } catch {
    return;
  }

};

// Image processing
var CheckBase64Image = (str) => {
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return isBase64(str, { allowMime: true });
  } catch (err) {
    return false;
  }
};

const UploadUserEditAvatar = async (img_avatar) => {
  try {
    const imageAvatarResult = await cloudinary.uploader.upload(img_avatar);
    img_avatar_url = imageAvatarResult.url;

    return img_avatar_url;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const HandleMessageImage = async (images) => {
  try {
    image_urls = [];

    for (var image of images) {
      image_url = await UploadUserEditAvatar(image);
      image_urls.push(image_url);
    }
    return image_urls;
  } catch (err) { }
};
