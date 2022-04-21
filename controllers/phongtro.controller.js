const path = require("path");
const multer = require("multer");
const fs = require("fs");
var jwt = require("jsonwebtoken");
var News = require('../models/News/news.model');
var User = require('../models/User/user.model');
var AuditLogSystem = require('../common/audit.log');
const status_news = require('../common/status.news');
const messageRes = require('../common/message.res');
require("dotenv");





//#################__Upload Image Avatar__#################

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("file");

module.exports.UploadAvarta = async (req, res) => {
    try {
        if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role) {

            await upload(req, res, (err) => {
                if (err) {
                    res.json({
                        result: false,
                        message_err: "Không thể upload Ảnh"
                    })
                };
                res.setHeader('Content-Type', 'image/jpeg');
                res.json({

                    result: true,
                    filename_avatar: req.file.filename
                });
            });
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
            res.json({
                message: "Bạn không có quyền này",
                result: false
            });
        }
    } catch (err) {
        res.json({

            result: false,
            message_err: "Không thể upload Ảnh"
        });
    }

}
//#########__Open Image Avatar__##############//
module.exports.getImageAvarta = async (req, res) => {

    let imagename = "public/uploads/" + req.params.imagename;
    await fs.readFile(imagename, (err, ImageData) => {
        if (err) res.json({
            result: false,
            message_err: "Lỗi không thể load ảnh"
        });
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(ImageData);
    })
}
//#########__Delete Image Avatar__##############//

module.exports.DeleteImageAvarta = async (req, res) => {
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role) {
        let imagename = "public/uploads/" + req.body.filename_avatar;
        await fs.unlink(imagename, (err) => {
            if (err) res.json({
                result: false,
                message_err: "Lỗi không thể xóa ảnh"
            });
            res.json({
                result: true
            })
        })
    } else {
        res.json({
            message: "Bạn không có quyền này",
            result: false
        });
    }
}

//#################__Upload Image Infor__#################

const upload_multipble = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).array("files", 10);

module.exports.UploadImageInfor = async (req, res) => {
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role) {
        let arrayimagename = [];
        await upload_multipble(req, res, (err) => {
            if (err) {
                res.json({
                    result: false,
                    message_err: "Lỗi không thể upload các ảnh"
                });
            }
            req.files.map(item => {
                arrayimagename.push(item.filename);
            })
            res.json({
                arrayimagenames: arrayimagename,
                result: true
            });
        });
    } else {
        res.json({
            message: "Bạn không có quyền này",
            result: false
        });
    }

}

module.exports.DeleteImageInfor = async (req, res) => {
    if (req.isAuthenticated() && 'CHUNHATRO' == req.user.role) {
        let imagename = "public/uploads/" + req.body.filename_imageinfor;
        await fs.unlink(imagename, (err) => {
            if (err) res.json({
                result: false,
                message_err: "Lỗi không thể xóa ảnh"
            });
            res.json({
                result: true
            })
        })
    } else {
        res.json({
            message: "Bạn không có quyền này",
            result: false
        });
    }
}

// Căn hộ
module.exports.PostNews = async (req, res) => {
    var token = decoded(req);

    let { title, content_infor, number_phone, price, acreage, img_avatar, img_infor,
        city, dictrict, street, nb_bedroom, nb_bath_toilet,
        nb_kitchenroom, utilities, typehome, address_detail } = req.body;

    var user = await User.findOne({ _id: token.UserId });

    if (user == null) {
        return res.json({
            success: true,
            message: messageRes.USERNAME_NOT_FOUND
        })
    }
    if (!isValidPhone(number_phone)) {
        return res.json({
            success: true,
            message: messageRes.PHONE_IS_NOT_VALID
        })
    }
    var news = new News();
    //    Infor 
    news.infor.iduser = token.UserId;
    news.infor.title = title;
    news.infor.content_infor = content_infor;
    news.infor.number_phone = number_phone;
    news.infor.price = price;
    news.infor.status_news = status_news.PENDING;
    news.infor.typehome = typehome;
    news.infor.acreage = acreage;
    // Number room 
    news.infor.nb_bedroom = nb_bedroom;
    news.infor.nb_bath_toilet = nb_bath_toilet;
    news.infor.nb_kitchenroom = nb_kitchenroom;
    // Image
    news.img_avatar = img_avatar;
    news.img_infor = img_infor;
    // Utilities
    news.utilities.isChecked_wifi = utilities.isChecked_wifi;
    news.utilities.isChecked_mezzanine = utilities.isChecked_mezzanine;
    news.utilities.isChecked_camera = utilities.isChecked_camera;
    news.utilities.isChecked_parking = utilities.isChecked_parking;
    news.utilities.isChecked_fridge = utilities.isChecked_wifi;
    news.utilities.isChecked_WashingMachine = utilities.isChecked_mezzanine;
    news.utilities.isChecked_AirConditional = utilities.isChecked_camera;
    news.utilities.isChecked_elevator = utilities.isChecked_parking;
    news.utilities.isChecked_pool = utilities.isChecked_wifi;
    news.utilities.isChecked_park = utilities.isChecked_mezzanine;
    news.utilities.isChecked_mattress = utilities.isChecked_camera;
    news.utilities.isChecked_television = utilities.isChecked_parking;
    //Address
    news.address.city = city;
    news.address.dictrict = dictrict;
    news.address.street = street;
    news.address.address_detail = address_detail;


    news = AuditLogSystem.SetFullInfo(token.UserId, token.UserName, news);
    news.save((err) => {
        if (err) console.log(err);
        res.json({
            message: "Đăng tin thành công",
            result: true
        });
    });
}


//  Post News Manager (Quản lý tin đăng)

module.exports.PostManagerPT = async (req, res) => {

    var token = decoded(req);
    await News.find({ "infor.iduser": token.UserId, "infor.typehome": 1 }, (err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: messageRes.INTERVAL_SERVER,
            })
        }
        res.json({
            success: true,
            message: messageRes.INF_SUCCESSFULLY,
            data: result
        })
    })

}
// Nha tro
module.exports.PostManagerNT = async (req, res) => {

    var token = decoded(req);
    await News.find({ "infor.iduser": token.UserId, "infor.typehome": 2 }, (err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: messageRes.INTERVAL_SERVER,
            })
        }
        res.json({
            success: true,
            message: messageRes.INF_SUCCESSFULLY,
            data: result
        })
    })
}
module.exports.PostManagerCH = async (req, res) => {

    var token = decoded(req);
    await News.find({ "infor.iduser": token.UserId, "infor.typehome": 3 }, (err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: messageRes.INTERVAL_SERVER,
            })
        }
        return res.status(200).json({
            success: true,
            message: messageRes.INF_SUCCESSFULLY,
            data: result
        })
    })

}

// Ẩn tin tức
module.exports.PostManagerHiddenNews = async (req, res) => {

    const token = decoded(req);
    const news = await News.find({ "_id": req.body.id });

    if (news == null) {
        return res.json({
            message: messageRes.NEWS_NOT_FOUND,
            success: false,
        })
    }

    if (news.infor.status_news == status_news.DELETE) {
        return res.json({
            message: messageRes.NEWS_NOT_FOUND,
            success: false,
        })
    }

    if (news.infor.iduser == decoded.UserId) {
        return res.json({
            message: messageRes.NEWS_NOT_FOUND,
            success: false,
        })
    }

    news.infor.status_news = status_news.DELETE;
    news = AuditLogSystem.SetFullInfo(token.UserId, token.UserName, news);
    await news.save();

}




var decoded = function (req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}


var isValidPhone = function (phone) {
    const pattern = "(\\+[0-9]{2}|\\+[0-9]{2}\\(0\\)|\\(\\+[0-9]{2}\\)\\(0\\)|00[0-9]{2}|0)([0-9]{9}|[0-9\\-\\s]{9,18})"
    return phone.match(pattern);
}