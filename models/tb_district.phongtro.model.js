var mongoose = require('mongoose');

var DistrictSchema = new mongoose.Schema(
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
        }
    },{
        versionKey:false
    }
);

var District= mongoose.model('District',DistrictSchema,'Dictrict')
module.exports=District;