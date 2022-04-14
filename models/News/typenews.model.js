var mongoose = require('mongoose');

var TypeNewsNewsSchema = new mongoose.Schema(
    {
        idnews:{
            type:String,
            required:true
        },
        nametype:{
            type:String,
            required:true
        }
      
    },{
        versionKey:false
    }
);

var TypeNews= mongoose.model('TypeNews',TypeNewsNewsSchema,'TypeNews')
module.exports=TypeNews;