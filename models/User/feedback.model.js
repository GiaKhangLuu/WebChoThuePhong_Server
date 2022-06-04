var mongoose = require('mongoose');
var today = new Date();
var FeedBackSchema = new mongoose.Schema(
    {
        feedback_sender: {
            type: mongoose.Types.ObjectId,
            required:true
        },
        feedback_receiver: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        content_feedback: {
            type: String,
            required: true
        },
        time_feedback: {
            type: Date,
            default: today
        },
        rate: {
            type: Number
        }
    },{
        versionKey: false
    }
);

var FeedBack= mongoose.model('FeedBack', FeedBackSchema, 'FeedBack')
module.exports = FeedBack;
