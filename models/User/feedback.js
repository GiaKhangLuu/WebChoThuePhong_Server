var mongoose = require('mongoose');
var today = new Date();
var FeebBackSchema = new mongoose.Schema(
    {
        iduser:{
            type:String,
            required:true
        },
        titelfeedback:{
            type:String,
            required:true
        },
        contentfeedback:{
            type:String,
            required:true
        },
        timefeedback:{
            type:Date,
            default:today
        }
      
    },{
        versionKey:false
    }
);

var FeebBack= mongoose.model('FeebBack',FeebBackSchema,'FeedBack')
module.exports=FeebBack;