var mongoose = require('mongoose');
var today = new Date();
var CommentSchema = new mongoose.Schema(
    {
        idnews:{
            type:String,
            required:true
        },
        idmb:{
            type:String,
            required:true
        },
        contentcomment:{
            type:String,
            required:true
        },
        timeComment:{
            type:String,
            default:today
        }
      
    },{
        versionKey:false
    }
);

var Comment= mongoose.model('Comment',CommentSchema,'Comment')
module.exports=Comment;