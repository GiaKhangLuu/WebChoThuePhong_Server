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
const isBase64 = require('is-base64');
const cloudinary = require('cloudinary').v2;




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

//#################__Upload Image Infor__#################

const upload_multipble = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).array("files", 10);

module.exports.UploadImageInfor = async (req, res) => {

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

}

module.exports.DeleteImageInfor = async (req, res) => {

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

}

// Căn hộ
module.exports.PostNews = async (req, res) => {
    var token = decoded(req);
    var news = await News.find({ "infor.status_news": { $ne: status_news.DELETE }, "infor.iduser": token.UserId })

    if (news.length >= 3) {
        return res.status(400).json({
            result: false,
            message: messageRes.LIMIT_NEWS
        })
    }
    let { title, content_infor, number_phone, price, acreage, img_avatar, img_infor,
        city, district, street, nb_bedroom, nb_bath_toilet,
        nb_kitchenroom, utilities, typehome, address_detail } = req.body;

    var user = await User.findOne({ _id: token.UserId });

    if (user == null) {
        return res.json({
            result: false,
            message: messageRes.USERNAME_NOT_FOUND
        })
    }
    if (!isValidPhone(number_phone)) {
        return res.json({
            result: false,
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
    try {
        if (!CheckBase64Image(img_avatar)) {
            return res.status(400).json({
                result: false,
                message: MessageRes.IMG_IS_NOT_VALID
            })
        }
        const imageAvatarResult = await cloudinary.uploader.upload(img_avatar);
        news.img_avatar = imageAvatarResult.url;
        for (let i = 0; i < img_infor.length; i++) {
            if (!CheckBase64Image(img_infor[i])) {
                return res.status(400).json({
                    result: false,
                    message: MessageRes.IMG_IS_NOT_VALID
                })
            }
            var imageInfoResult = await cloudinary.uploader.upload(img_infor[i]);
            news.img_infor[i] = imageInfoResult.url;
        }
    }
    catch (err) {
        res.status(500).json({ err: 'Lỗi không upload được hình ảnh' });
    }
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
    news.address.district = district;
    news.address.street = street;
    news.address.address_detail = address_detail;


    news = AuditLogSystem.SetFullInfo(token.UserId, token.UserName, news);
    await news.save((err) => {
        if (err) {
            return res.status(400).json({
                message: "Đăng tin thất bại",
                result: false
            });
        }
        else {
            return res.status(200).json({
                message: "Đăng tin thành công",
                result: true
            });
        }
    });
}

module.exports.DetailNews = async (req, res) => {
    var token = decoded(req);
    var news = await News.findOne({ "_id": req.params.id, "infor.status_news": { $ne: status_news.DELETE }, "infor.iduser": token.UserId });

    if (!news) {
        return res.status(404).json({
            success: false,
            message: messageRes.NEWS_NOT_FOUND,
        })
    }

    return res.status(200).json({
        success: true,
        message: messageRes.INF_SUCCESSFULLY,
        data: news
    })
}

module.exports.UpdateNews = async (req, res) => {
    var token = decoded(req);
    let { title, content_infor, number_phone, price, acreage, img_avatar, img_infor,
        city, district, street, nb_bedroom, nb_bath_toilet,
        nb_kitchenroom, utilities, typehome, address_detail } = req.body;


    if (!isValidPhone(number_phone)) {
        return res.status(400).json({
            success: false,
            message: messageRes.PHONE_IS_NOT_VALID
        })
    }
    var news = await News.findOne({ "_id": req.params.id, "infor.iduser": token.UserId })
    if (!news) {
        return res.status(404).json({
            success: false,
            message: messageRes.NEWS_NOT_FOUND,
        })
    }
    //    Infor 
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
    try {
        if (news.img_avatar != img_avatar) {
            if (!CheckBase64Image(img_avatar)) {
                return res.status(400).json({
                    result: false,
                    message: MessageRes.IMG_IS_NOT_VALID
                })
            }
            const imageAvatarResult = await cloudinary.uploader.upload(img_avatar);
            news.img_avatar = imageAvatarResult.url;
        }

        if (news.img_infor.length == img_infor.length) {
            for (let i = 0; i < img_infor.length; i++) {
                if (news.img_infor[i] != img_infor[i]) {
                    if (!CheckBase64Image(img_infor[i])) {
                        return res.status(400).json({
                            result: false,
                            message: MessageRes.IMG_IS_NOT_VALID
                        })
                    }
                    var imageInfoResult = await cloudinary.uploader.upload(img_infor[i]);
                    news.img_infor[i] = imageInfoResult.url;
                }
            }
        }
        else {
            for (let i = 0; i < img_infor.length; i++) {
                if (!CheckBase64Image(img_infor[i])) {
                    return res.status(400).json({
                        result: false,
                        message: MessageRes.IMG_IS_NOT_VALID
                    })
                }
                var imageInfoResult = await cloudinary.uploader.upload(img_infor[i]);
                news.img_infor[i] = imageInfoResult.url;
            }
        }

    }
    catch (err) {
        res.status(500).json({ err: 'Lỗi không upload được hình ảnh' });
    }
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
    news.address.district = district;
    news.address.street = street;
    news.address.address_detail = address_detail;


    news = AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, news);
    await news.save((err) => {
        if (err) {
            return res.status(400).json({
                message: "Cập nhật tin thất bại",
                result: false
            });
        }
        else {
            return res.status(200).json({
                message: "Cập nhật tin thành công",
                result: true
            });
        }
    });
}



//  Post News Manager (Quản lý tin đăng)

module.exports.PostManagerPT = async (req, res) => {

    var token = decoded(req);
    await News.find({ "infor.iduser": token.UserId, "infor.status_news": { $ne: status_news.DELETE }, "infor.typehome": 1 }, (err, result) => {
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
    await News.find({ "infor.iduser": token.UserId, "infor.status_news": { $ne: status_news.DELETE }, "infor.typehome": 2 }, (err, result) => {
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
    IsEnoughNewsHave(token.UserId);
    await News.find({ "infor.iduser": token.UserId, "infor.status_news": { $ne: status_news.DELETE }, "infor.typehome": 3 }, (err, result) => {
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


    try {
        const token = decoded(req);
        const news = await News.findOne({ "_id": req.params.id });

        if (news == null) {
            return res.json({
                message: messageRes.NEWS_NOT_FOUND,
                result: true,
            })
        }

        if (news.infor.status_news == status_news.DELETE) {
            return res.json({
                message: messageRes.NEWS_NOT_FOUND,
                result: true,
            })
        }

        if (news.infor.iduser == decoded.UserId) {
            return res.json({
                message: messageRes.NEWS_NOT_FOUND,
                result: true,
            })
        }

        news.infor.status_news = status_news.DELETE;
        await news.save();


        return res.status(200).json({
            message: "Xóa tin rao thành công",
            result: true,
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err,
            result: false
        });
    }

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

var CheckBase64Image = (str) => {
    if (str === '' || str.trim() === '') { return false; }
    try {
        return isBase64(str, { allowMime: true })
    } catch (err) {
        return false;
    }
}