const path = require("path");
const multer = require("multer");
const fs=require("fs");

var Citys = require('../models/tb_city.phongtro.model');
var Districts = require('../models/tb_district.phongtro.model');
var Streets = require('../models/tb_street.phongtro.model');
var News =require('../models/News/news.model');


//#################__Select Citys__#################


module.exports.citys= async (req,res)=>{
   let citys = await Citys.find();
    res.json({
        citys:citys
    })
}
//#################__Select Districts__#################
module.exports.districts= async (req,res)=>{
    let {parent_code}= req.body;
    await Districts.find({parent_code},(err,result)=>{
        res.json({
            districts:result
        })
    });
     
 }
 
 module.exports.StreetstoCitys= async (req,res)=>{
    await Streets.find({"parent_code_city":req.params.code_city},(err,result)=>{
        if(err) console.log(err);
        res.json({
            streets:result
        })
    });
 }
 //#################__Select Stress__#################

 module.exports.streets= async (req,res)=>{
    let {parent_code,parent_code_city}= req.body;
    await Streets.find({parent_code,parent_code_city},(err,result)=>{
        if(err) console.log(err);
        
        res.json({
            streets:result
        })
    });
 }


//#################__Upload Image Avatar__#################

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("file");

 module.exports.UploadAvarta= async (req,res)=>{
  try{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
     
     await upload(req, res, (err) => {
         if(err) {
             res.json({
                 result:false,
                 message_err:"Không thể upload Ảnh"
             })
         };
         res.setHeader('Content-Type','image/jpeg');
         res.json({
         
             result:true,
             filename_avatar:req.file.filename
         });
       });
     }else{
        res.setHeader('Content-Type','image/jpeg');
         res.json({
             message:"Bạn không có quyền này",
             result:false    
         });
     }
  }catch(err){
    res.json({
       
        result:false,
        message_err:"Không thể upload Ảnh"
    });
  }
    
 }
    //#########__Open Image Avatar__##############//
module.exports.getImageAvarta= async (req,res)=>{

    let imagename= "public/uploads/"+req.params.imagename;
    await fs.readFile(imagename,(err,ImageData)=>{
        if(err) res.json({
            result:false,
            message_err:"Lỗi không thể load ảnh"
        });
        res.setHeader('Content-Type','image/jpeg');
        res.end(ImageData);
    })
}
    //#########__Delete Image Avatar__##############//

module.exports.DeleteImageAvarta= async (req,res)=>{
if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
   { 
    let imagename= "public/uploads/"+req.body.filename_avatar;
    await fs.unlink(imagename,(err)=>{
        if(err) res.json({
            result:false,
            message_err:"Lỗi không thể xóa ảnh"
        });
        res.json({
            result:true
        })
    })
    }else{
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
}

//#################__Upload Image Infor__#################

 const upload_multipble = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).array("files",10);

 module.exports.UploadImageInfor= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        let arrayimagename=[];
        await upload_multipble(req, res,(err)=> {
            if(err) {
                res.json({
                    result:false,
                    message_err:"Lỗi không thể upload các ảnh"
                });
            }
            req.files.map(item=>{
                arrayimagename.push(item.filename);
            })
            res.json({
                arrayimagenames:arrayimagename,
                result:true
            });        
        });
    }else{
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
   
 }

 module.exports.DeleteImageInfor= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        let imagename= "public/uploads/"+req.body.filename_imageinfor;
        await fs.unlink(imagename,(err)=>{
            if(err) res.json({
                result:false,
                message_err:"Lỗi không thể xóa ảnh"
            });
            res.json({
                result:true
            })
        })
    }else{
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
}
// Đăng tin phòng trọ
module.exports.PostNewsPT= async (req,res)=>{
    try{
        if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
        { 
            let{title,content_infor,number_phone,price,acreage,
                img_avatar,img_infor,code_city,code_dictrict,
                code_street,Lat_ggmap,Lng_ggmap,typehome,utilities,date_now,date_finish,address_detail}=req.body;
                
                var newPhongTro = new News();
                //    Infor 
                    newPhongTro.infor.iduser=req.user._id;
                    newPhongTro.infor.title=title;
                    newPhongTro.infor.content_infor=content_infor;
                    newPhongTro.infor.number_phone=number_phone;
                    newPhongTro.infor.price=price;
                    newPhongTro.infor.typehome=typehome;
                    newPhongTro.infor.acreage=acreage;
                    newPhongTro.infor.datetime_create=date_now;
                    newPhongTro.infor.datetime_finish=date_finish;
                // Image
                    newPhongTro.img_avatar=img_avatar;
                    newPhongTro.img_infor=img_infor;
                // Utilities
                    newPhongTro.utilities.isChecked_wifi=utilities.isChecked_wifi;
                    newPhongTro.utilities.isChecked_mezzanine=utilities.isChecked_mezzanine;
                    newPhongTro.utilities.isChecked_camera=utilities.isChecked_camera;
                    newPhongTro.utilities.isChecked_parking=utilities.isChecked_parking;
                //Address
                    newPhongTro.address.code_city=code_city;
                    newPhongTro.address.code_dictrict=code_dictrict;
                    newPhongTro.address.code_street=code_street;
                    newPhongTro.address.address_detail=address_detail;
                // Google Map
                    newPhongTro.address.Lat_ggmap=Lat_ggmap;
                    newPhongTro.address.Lng_ggmap=Lng_ggmap;    
                newPhongTro.save((err)=>{
                    if(err) {
                        res.json({
                            message:"Lỗi không thể đăng tin!! Vui lòng kiểm tra lại",
                            result:false
                        });
                    }
                    res.json({
                        message:"Đăng tin thành công",
                        result:true
                    });
            });
            }else {
                res.json({
                    message:"Bạn không có quyền này",
                    result:false    
                });
            }
    }catch(err){
            res.json({
                message:err,
                result:false
            });
    }

}

// Đăng tin nhà trọ
module.exports.PostNewsNT= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        let{ title,content_infor,number_phone,price,acreage,img_avatar,img_infor,
            code_city,code_dictrict,code_street,Lat_ggmap,Lng_ggmap,nb_bedroom,nb_bath_toilet,
            nb_kitchenroom,utilities,date_now,date_finish,typehome,address_detail}=req.body;
        var newNhaTro = new News();
        //    Infor 
            newNhaTro.infor.iduser=req.user._id;
            newNhaTro.infor.title=title;
            newNhaTro.infor.content_infor=content_infor;
            newNhaTro.infor.number_phone=number_phone;
            newNhaTro.infor.price=price;
            newNhaTro.infor.datetime_create=date_now;
            newNhaTro.infor.typehome=typehome;
            newNhaTro.infor.acreage=acreage;
            // Number room 
            newNhaTro.infor.nb_bedroom=nb_bedroom;
            newNhaTro.infor.nb_bath_toilet=nb_bath_toilet;
            newNhaTro.infor.nb_kitchenroom=nb_kitchenroom;
            // Date news
            newNhaTro.infor.datetime_create=date_now;
            newNhaTro.infor.datetime_finish=date_finish;
        // Image
            newNhaTro.img_avatar=img_avatar;
            newNhaTro.img_infor=img_infor;
        // Utilities
            newNhaTro.utilities.isChecked_wifi=utilities.isChecked_wifi;
            newNhaTro.utilities.isChecked_mezzanine=utilities.isChecked_mezzanine;
            newNhaTro.utilities.isChecked_camera=utilities.isChecked_camera;
            newNhaTro.utilities.isChecked_parking=utilities.isChecked_parking;
            newNhaTro.utilities.isChecked_fridge=utilities.isChecked_wifi;
            newNhaTro.utilities.isChecked_WashingMachine=utilities.isChecked_mezzanine;
            newNhaTro.utilities.isChecked_AirConditional=utilities.isChecked_camera;
            newNhaTro.utilities.isChecked_elevator=utilities.isChecked_parking;
            newNhaTro.utilities.isChecked_pool=utilities.isChecked_wifi;
            newNhaTro.utilities.isChecked_park=utilities.isChecked_mezzanine;
            newNhaTro.utilities.isChecked_mattress=utilities.isChecked_camera;
            newNhaTro.utilities.isChecked_television=utilities.isChecked_parking;
        //Address
            newNhaTro.address.code_city=code_city;
            newNhaTro.address.code_dictrict=code_dictrict;
            newNhaTro.address.code_street=code_street;
            newNhaTro.address.address_detail=address_detail;
        // Google Map
            newNhaTro.address.Lat_ggmap=Lat_ggmap;
            newNhaTro.address.Lng_ggmap=Lng_ggmap;    
            newNhaTro.save((err)=>{
            if(err) console.log(err);
            res.json({
                message:"Đăng tin thành công",
                result:true
            });
        });
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
 
 } 
// Căn hộ
module.exports.PostNewsCH= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        let{ title,content_infor,number_phone,price,acreage,img_avatar,img_infor,
            code_city,code_dictrict,code_street,Lat_ggmap,Lng_ggmap,nb_bedroom,nb_bath_toilet,
            nb_kitchenroom,utilities,date_now,date_finish,typehome,address_detail}=req.body;
        var newCanHo= new News();
        //    Infor 
            newCanHo.infor.iduser=req.user._id;
            newCanHo.infor.title=title;
            newCanHo.infor.content_infor=content_infor;
            newCanHo.infor.number_phone=number_phone;
            newCanHo.infor.price=price;
            newCanHo.infor.datetime_create=date_now;
            newCanHo.infor.typehome=typehome;
            newCanHo.infor.acreage=acreage;
            // Number room 
            newCanHo.infor.nb_bedroom=nb_bedroom;
            newCanHo.infor.nb_bath_toilet=nb_bath_toilet;
            newCanHo.infor.nb_kitchenroom=nb_kitchenroom;
            // Date news
            newCanHo.infor.datetime_create=date_now;
            newCanHo.infor.datetime_finish=date_finish;
        // Image
        newCanHo.img_avatar=img_avatar;
        newCanHo.img_infor=img_infor;
        // Utilities
        newCanHo.utilities.isChecked_wifi=utilities.isChecked_wifi;
        newCanHo.utilities.isChecked_mezzanine=utilities.isChecked_mezzanine;
        newCanHo.utilities.isChecked_camera=utilities.isChecked_camera;
        newCanHo.utilities.isChecked_parking=utilities.isChecked_parking;
        newCanHo.utilities.isChecked_fridge=utilities.isChecked_wifi;
        newCanHo.utilities.isChecked_WashingMachine=utilities.isChecked_mezzanine;
        newCanHo.utilities.isChecked_AirConditional=utilities.isChecked_camera;
        newCanHo.utilities.isChecked_elevator=utilities.isChecked_parking;
        newCanHo.utilities.isChecked_pool=utilities.isChecked_wifi;
        newCanHo.utilities.isChecked_park=utilities.isChecked_mezzanine;
        newCanHo.utilities.isChecked_mattress=utilities.isChecked_camera;
        newCanHo.utilities.isChecked_television=utilities.isChecked_parking;
        //Address
        newCanHo.address.code_city=code_city;
        newCanHo.address.code_dictrict=code_dictrict;
        newCanHo.address.code_street=code_street;
        newCanHo.address.address_detail=address_detail;
        // Google Map
        newCanHo.address.Lat_ggmap=Lat_ggmap;
        newCanHo.address.Lng_ggmap=Lng_ggmap;    
        newCanHo.save((err)=>{
            if(err) console.log(err);
            res.json({
                message:"Đăng tin thành công",
                result:true
            });
        });
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }

}

//  Post News Manager (Quản lý tin đăng)

module.exports.PostManagerPT= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 

       
        await News.find({"infor.iduser":req.user._id,"infor.typehome":1},(err,result)=>{
            if(err) console.log(err);
            res.json({
                list_PT:result
            })
        })
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
}
                    // Nha tro
module.exports.PostManagerNT= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        await News.find({"infor.iduser":req.user._id,"infor.typehome":2},(err,result)=>{
            if(err) console.log(err);
            res.json({
                list_NT:result
            })
        })
        
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }

}
module.exports.PostManagerCH= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        await News.find({"infor.iduser":req.user._id,"infor.typehome":3},(err,result)=>{
            if(err) console.log(err);
            res.json({
                list_CH:result
            })
        })
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }

}

// Ẩn tin tức
module.exports.PostManagerHiddenNewsPT= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        await News.findByIdAndUpdate({"_id":req.body.id},{"infor.state_news":false},(err,result)=>{
            if(err) console.log(err);
            News.find({"infor.iduser":req.user._id,"infor.typehome":1},(err,result)=>{
                if(err) console.log(err);
                res.json({
                    list_PT:result
                })
            })
        })
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }

}

module.exports.PostManagerHiddenNewsCH= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        await News.findByIdAndUpdate({"_id":req.body.id},{"infor.state_news":false},(err,result)=>{
            if(err) console.log(err);
            News.find({"infor.iduser":req.user._id,"infor.typehome":2},(err,result)=>{
                if(err) console.log(err);
                res.json({
                    list_CH:result
                })
            })
        })
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
}

module.exports.PostManagerHiddenNewsNT= async (req,res)=>{
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role)
    { 
        await News.findByIdAndUpdate({"_id":req.body.id},{"infor.state_news":false},(err,result)=>{
            if(err) console.log(err);
            News.find({"infor.iduser":req.user._id,"infor.typehome":3},(err,result)=>{
                if(err) console.log(err);
                res.json({
                    list_NT:result
                })
            })
        })
    }else {
        res.json({
            message:"Bạn không có quyền này",
            result:false    
        });
    }
}



