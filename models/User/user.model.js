var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
{ 
    infor:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        male_female:{
            male:{
                type:Boolean,
                default:true
            },
            female:{
                type:Boolean,
                default:false
            }
        },
        img_avatar:{
            type:String,
            default:''
        }
    },
    local:{
        username: {
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
    },
    role:{
        type:String,
        default:'MEMBER'
    },
    number_phone:{
        type:Number,
        default:''
    }
}
    ,{
        versionKey:false
}
);

var User= mongoose.model('User',UserSchema,'User')
module.exports=User;