var mongoose = require('mongoose');

var StreetSchema = new mongoose.Schema(
    {
        code: {
            type:Number,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        typename:{
            type:String,
            required:true
        },
        parent_code:{
            type:Number,
            required:true
        },
        parent_code_city:{
            type:Number,
            required:true
        }
    },{
        versionKey:false
    }
);

var Street= mongoose.model('Street',StreetSchema,'Street')
module.exports=Street;