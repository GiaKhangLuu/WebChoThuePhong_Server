const mongoose = require('mongoose')

var ChatRoom = require('../models/Messages/chatroom.model')
var FeedBack = require('../models/User/feedback.model')
var Message = require('../models/Messages/message.model')

//############ Show FeedBack ##############
module.exports.ShowFeedBackReceiver = async (req, res) => {
    try {
        var user_id = req.body.user_id
        var rooms = await ChatRoom.FindUserInforOfAllRooms(user_id)

        var rs = []

        for (var room of rooms) {
            var room_id = room.room_info._id
            var room_members = room.room_info.members            

            if (room_members.length == 0) {
                res.json({
                    success: false,
                    data: null
                })
                return
            }

            var room_member = room_members[0]
            var member_id = room_member._id

            // Check feedback_receiver has sent message yet
            var messages_from_member = await Message.FindMessageById(room_id, member_id)
            var own_messages = await Message.FindMessageById(room_id, user_id)
            if (messages_from_member.length >= 1 && own_messages.length >= 1) {
                rs.push({ "room_id": room_id,
                          "room_member": room_member,})
            }
        }

        res.json({
            success: true,
            data: rs 
        })

    } catch(err) {
        console.log(err)
        return null
    }
}

//############ Create FeedBack ##############
const create_feedback = async (feedback_sender, feedback_receiver, content,
    rate) => {
    var feedback = new FeedBack()
    feedback.feedback_sender = mongoose.Types.ObjectId(feedback_sender)
    feedback.feedback_receiver = mongoose.Types.ObjectId(feedback_receiver)
    feedback.content_feedback = content
    feedback.rate = rate
    feedback = await FeedBack.create(feedback)

    return feedback

}

//############ Update FeedBack ##############
const update_feedback = async (feedback_id, content, rate) => {
    var feedback = await FeedBack.findByIdAndUpdate(
        feedback_id,
        { $set: { content_feedback: content, 
                  rate: rate,
                  time_feedback: new Date() } }
    )
    return feedback
}

module.exports.SendFeedback = async (req, res) => {
    const feedback_receiver = req.body.feedback_receiver
    const feedback_sender = req.body.feedback_sender
    const content = req.body.content
    const rate = req.body.rate
    try {
        const feedbacks = await FeedBack.aggregate([
            { $match: { $and: [ { feedback_sender: mongoose.Types.ObjectId(feedback_sender)},
                                { feedback_receiver: mongoose.Types.ObjectId(feedback_receiver) } ] } }
        ])

        var feedback
        if (feedbacks.length == 0) {
            feedback = await create_feedback(feedback_sender, feedback_receiver,
                content, rate) 
        } else {
            var feedback_id = feedbacks[0]._id
            feedback = await update_feedback(feedback_id, content, rate)
        }

        res.json({
            success: true,
            data: feedback
        })

    } catch(err) {
        console.log(err)
        res.json({
            success: false,
            data: null
        })
    }
}
