const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mongoose = require('mongoose')

var Message = require('../../models/Messages/message.model');
const status_message = require('../../common/status.message');
var ChatRoom = require('../../models/Messages/chatroom.model')


//############ Create Message   ##############
module.exports.CreateMessage = async (req, res) => {
  const { id_sender, id_receiver, message_content } = req.body

  try {
    // Create new message
    var newMessage = new Message({
      'id_sender': id_sender,
      'id_receiver': id_receiver,
      'message_content': message_content,
    })
    await newMessage.save()

    res.json({
      success: true,
      data: newMessage._id
    })
  } catch(err) {
    console.log(err)
    res.status(500).json({ success: false })
  }
}

module.exports.LoadOldMessages = async (req, res) => {
    var receiver_id = req.body.IdReceiver
    var sender_id = req.body.IdSender

    try {

        // Find room of user
        var rooms = await ChatRoom.FindChatRoom(sender_id, receiver_id)

        // In case user and receiver havent chatted yet, return []
        if(rooms.length == 0) {
            return []
        }

        var room_id = rooms[0]._id

        // Load old messages
        var messages = await Message.LoadOldMessages(sender_id, room_id)

        res.json({
          success: true,
          data: messages 
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({ success: false })
    }
}

module.exports.LoadRooms = async (req, res) => {
    try {
        var user_id = req.body.user_id
        var rooms = await ChatRoom.FindUserInforOfAllRooms(user_id)
        //console.log(rooms)

        res.json({
            success: true,
            data: rooms
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({ success: false })
    }
}

module.exports.UnreadMessageCount = async (req, res) => {
    try {
        var user_id = req.body.user_id
        var unread_message_count = await ChatRoom.UnreadMessageCount(user_id)
        
        res.json({
            success: true,
            data: unread_message_count
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({ success: false })
    }
}
