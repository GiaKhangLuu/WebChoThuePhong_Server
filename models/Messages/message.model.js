var mongoose = require('mongoose');
var today = new Date();
var MessageSchema = new mongoose.Schema(
    {
        id_sender:{
            type:String,
            required:true
        },
        id_receiver: {
         type: String,
         require: true
        },
        message_content: {
          type: String,
          require: true
       },
      status: {
        type: int,
        require: true,
        default: 0
      }
    },{
        versionKey:false
    }
);

var Message = mongoose.model('Message', MessageSchema, 'Message')
module.exports = Message;
