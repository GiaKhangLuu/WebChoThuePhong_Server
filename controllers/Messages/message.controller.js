const path = require("path");
const multer = require("multer");
const fs = require("fs");

var Message = require('../../models/Messages/message');
const status_message = require('../../common/status.message');


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
