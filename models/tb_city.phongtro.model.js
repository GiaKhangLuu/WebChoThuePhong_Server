var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema(
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
        }
    },{
        versionKey:false
    }
);

var City= mongoose.model('City',CitySchema,'City')
module.exports=City;