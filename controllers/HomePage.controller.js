
var News = require('../models/News/news.model');
var MessageRes = require('../common/message.res');
var StatusNews = require('../common/status.news');
var ReportNews = require('../models/News/report.model');
var WishList = require('../models/News//wishlist.model');
var AuditLogSystem = require('../common/audit.log');
const EmailCommon = require("../common/email.constaint");
var User = require('../models/User/user.model');
const mailer = require('../utils/mailer');
var FeedBack = require('../models/User/feedback.model')
var jwt = require("jsonwebtoken");
var Role = require('../common/role');
const isBase64 = require('is-base64');
const cloudinary = require('cloudinary').v2;
module.exports.News_All = async (req, res) => {
    try {
        await News.find({ "infor.status_news": StatusNews.ACCEPTED }).limit(6).exec(
            (err, result) => {
                if (err) console.log(err);
                res.json({
                    All_News: result
                })
            })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}

module.exports.News_Special = async (req, res) => {
    var token = decoded(req);
    try {
        if (token == null) {
            await News.find({ "infor.status_news": StatusNews.ACCEPTED }).limit(8).exec((err, products) => {
                if (err) return res.status(400).json({ result: false, message: err })
                return res.status(200).json({
                    result: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: products
                })
            })
        }
        else {

            var products = await News.find({ "infor.status_news": StatusNews.ACCEPTED }).limit(8);
            for (let i = 0; i < products.length; i++) {
                var wishList = await WishList.findOne({ "idnews": products[i]._id });
                if (wishList) {
                    products[i].set("isWishList", true, { strict: false });
                }
                else {
                    products[i].set("isWishList", false, { strict: false });
                }

            }

            return res.status(200).json({
                result: true,
                message: MessageRes.INF_SUCCESSFULLY,
                data: products
            })

        }

    }
    catch {
        return res.status(500).json({
            result: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }
}

module.exports.News_Detail = async (req, res) => {
    try {
        const news = await News.findOne({ "_id": req.params.id });
        if (!news) {
            return res.status(404).json({
                success: false,
                data: news,
                message: MessageRes.NEWS_NOT_FOUND
            })
        }
        else return res.status(200).json({
            success: true,
            data: news,
            message: MessageRes.INF_SUCCESSFULLY
        })

    } catch (err) {
        res.json({
            success: false,
            message: err
        })
    }
}

module.exports.GetNameCity = async (req, res) => {
    try {
        await Citys.findOne({ "code": req.params.code_city }, (err, result) => {
            if (err) console.log(err);
            res.json({
                NameCity: result.name
            })
        })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}
module.exports.GetNameDictrict = async (req, res) => {
    try {
        await Districts.findOne({ "code": req.params.code_dictrict }, (err, result) => {
            if (err) console.log(err);
            res.json({
                NameDistricts: result.typename
            })
        })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}
module.exports.NewsNears = async (req, res) => {
    try {
        const { idNews, city, typehome } = req.body;
        await News.find({ "_id": { $ne: idNews }, "address.city": city, "infor.typehome": typehome, "infor.status_news": StatusNews.ACCEPTED }).limit(4).exec((err, result) => {
            if (err) return res.status(400).json({
                success: false,
                meesage: MessageRes.NEWS_NOT_FOUND
            });
            else {
                return res.status(200).json({
                    success: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: result
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }
}

module.exports.News_RoomHome = async (req, res) => {
    try {
        await News.find({ "infor.status_news": StatusNews.ACCEPTED, "infor.typehome": 1 }).limit(6).exec(
            (err, result) => {
                if (err) console.log(err);
                res.json({
                    result: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: result
                })
            })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}
module.exports.News_HouseHome = async (req, res) => {
    try {
        await News.find({ "infor.status_news": StatusNews.ACCEPTED, "infor.typehome": 2 }).limit(6).exec(
            (err, result) => {
                if (err) console.log(err);
                res.json({
                    result: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: result
                })
            })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}
module.exports.News_ApartmentHome = async (req, res) => {
    try {
        await News.find({ "infor.status_news": StatusNews.ACCEPTED, "infor.typehome": 3 }).limit(6).exec(
            (err, result) => {
                if (err) console.log(err);
                res.json({
                    result: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: result
                })
            })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}
module.exports.NewsFilter = async (req, res) => {

    try {

        var { city, district, street, typeHome, priceMin, priceMax, acreageMin, acreageMax } = req.body;

        var query = {};
        query["infor.status_news"] = StatusNews.ACCEPTED;

        //filter address
        if (city != '') {
            query["address.city"] = city;
        }

        if (district != '') {
            query["address.district"] = district;
        }

        if (street != '') {
            query["address.street"] = street;
        }

        // filter loại nhà
        if (typeHome != '') {
            query["infor.typehome"] = typeHome;
        }

        // filter giá tiền
        if (priceMin != null && priceMax != null) {
            query["infor.price"] = { $gte: priceMin, $lte: priceMax };
        }

        // filter diện tích
        if (acreageMin != null && acreageMax != null) {
            query["infor.acreage"] = { $gte: acreageMin, $lte: acreageMax };
        }

        await News.find(query).exec(
            (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(400).json({
                        result: false,
                        message: err ? err : MessageRes.INTERVAL_SERVER
                    })
                }
                return res.status(200).json({
                    result: true,
                    message: MessageRes.INF_SUCCESSFULLY,
                    data: result
                })
            })

    } catch (err) {
        return res.status(500).json({
            result: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }
}

module.exports.ProfileOrtherUser = async (req, res) => {

    var idUser = req.params.id;

    var user = await User.findOne(
        { "_id": idUser, "role": { $ne: Role.ADMIN } },
        {
            infor: "$infor",
            local:
            {
                username: "$local.username",
                email: "$local.email"
            },
            address: "$address",
            role: "$role",
            number_phone: "$number_phone",
        }
    )

    if (!user) {
        return res.status(404).json({
            result: false,
            message: MessageRes.USERNAME_NOT_FOUND,
            data: null,
        })
    }

    var feedback = await FeedBack.find({ iduser: idUser });
    var news = await News.find({ "infor.iduser": idUser, "infor.status_news": StatusNews.ACCEPTED });

    return res.status(200).json({
        result: true,
        message: MessageRes.INF_SUCCESSFULLY,
        data: { user, feedback, news },
    })

}

module.exports.ReportNews = async (req, res) => {

    var token = decoded(req);
    var { idNews, title, image, content } = req.body;
    try {
        var limitReportInDay = await ReportNews.find({ "idReporter": token.UserId, "idNews": idNews, "status": StatusNews.PENDING });

        if (limitReportInDay.length >= 1) {
            return res.status(400).json({
                result: false,
                message: MessageRes.REPORT_FAILED
            })
        }
        var news = await News.findOne({ "_id": idNews, "infor.status_news": StatusNews.ACCEPTED });
        if (!news) {
            return res.status(404).json({
                result: false,
                message: MessageRes.NEWS_NOT_FOUND
            })
        }

        if ((content == null || content == undefined) && (image == null || image == undefined)) {
            return res.status(400).json({
                result: false,
                message: MessageRes.IMG_AND_CONTENT_IS_REQUIRED
            })
        }

        var user = await User.findOne({ "_id": token.UserId });

        var newReport = new ReportNews({
            idNews,
            idReporter: token.UserId,
            title,
            content,
            status: StatusNews.PENDING
        });

        for (let i = 0; i < image.length; i++) {
            if (!CheckBase64Image(image[i])) {
                return res.status(400).json({
                    result: false,
                    message: MessageRes.IMG_IS_NOT_VALID
                })
            }
            var imageInfoResult = await cloudinary.uploader.upload(image[i]);
            newReport.image[i] = imageInfoResult.url;
        }

        await mailer.sendMail(user.local.email, EmailCommon.EMAIL_REPORT_NEWS_SUBJECT, EmailCommon.EMAIL_REPORT_NEWS_TEMPLATE);
        newReport = AuditLogSystem.SetFullInfo(token.UserId, token.UserName, newReport);
        await newReport.save();
        return res.status(200).json({
            result: true,
            message: MessageRes.INF_SUCCESSFULLY
        })
    }
    catch {
        return res.status(500).json({
            result: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }

}

var CheckBase64Image = (str) => {
    if (str === '' || str.trim() === '') { return false; }
    try {
        return isBase64(str, { allowMime: true })
    } catch (err) {
        return false;
    }
}
var decoded = function (req) {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch {
        return null;
    }
}
