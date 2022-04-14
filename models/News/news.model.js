var mongoose = require('mongoose');
var today = new Date();
var NewsSchema = new mongoose.Schema(
    {
       infor:{
            iduser:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            },
            content_infor:{
                type:String,
                required:true
            },
            number_phone:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            acreage:{
                type:Number,
                required:true
            },
            typehome:{
                type:Number,
                required:true
            },
            nb_bedroom:{
                type:Number,
                default:1
            },
            nb_bath_toilet:{
                type:Number,
                default:1
            },
            nb_kitchenroom:{
                type:Number,
                default:1
            },
            datetime_create:{
                type:String,
                required:true
            },
            date_now:{
                type:Date,
                default:today
            },
            datetime_finish:{
                type:String,
                required:true
            },
            state_news:{
                type:Boolean,
                default:true
            }
       }, 
      
       utilities:{
        isChecked_wifi:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_mezzanine:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_camera:{
                type: Boolean, 
                default: false 
        },
        isChecked_parking: { 
            type: Boolean, 
            default: false 
        },isChecked_fridge:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_WashingMachine:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_television:{
                type: Boolean, 
                default: false 
        },
        isChecked_AirConditional: { 
            type: Boolean, 
            default: false 
        },isChecked_elevator:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_pool:{ 
            type: Boolean, 
            default: false 
        },
        isChecked_park:{
            type: Boolean, 
            default: false 
        },
        isChecked_mattress: { 
            type: Boolean, 
            default: false 
        }
       },
       img_avatar:{
            type:String,
            required:true
       },
       img_infor:{
        type:Object,
        required:true
       },
       address:{
           code_city:{
            type:Number,
                required:true
           },
           code_dictrict:{
            type:Number,
            required:true
            },
           code_street:{
            type:Number,
            required:true
           },
           Lat_ggmap:{
            type:Number,
            required:true
           },
           Lng_ggmap:{
            type:Number,
            required:true
           },
           address_detail:{
            type:String,
            required:true
           }
       }
    },{
        versionKey:false
    }
);

var NewsSchema= mongoose.model('News',NewsSchema,'News')
module.exports=NewsSchema;