
var News = require('../models/News/news.model');
var MessageRes = require('../common/message.res');
var StatusNews = require('../common/status.news');
var ReportNews = require('../models/News/report.model');
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
    try {
        await News.find({ "infor.status_news": StatusNews.ACCEPTED }).limit(8).exec((err, products) => {
            if (err) return res.status(400).json({ result: false, message: err })
            return res.status(200).json({
                result: true,
                message: MessageRes.INF_SUCCESSFULLY,
                data: products
            })
        })
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
        const { city, typehome } = req.body;
        await News.find({ "address.city": city, "infor.typehome": typehome, "infor.status_news": StatusNews.ACCEPTED }).limit(4).exec((err, result) => {
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

module.exports.ReportNews = async (req, res) => {

    var { idNews, title, image, content, emailReporter } = req.body;

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


    if (!isValidEmail(emailReporter)) {
        return res.status(400).json({
            result: false,
            message: MessageRes.EMAIL_INCORRECT_FORMAT
        })
    }

    var newReport = new ReportNews({
        idNews,
        title,
        content,
        emailReporter,
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
    await newReport.save();


    return res.status(200).json({
        result: true,
        message: MessageRes.INF_SUCCESSFULLY
    })
}

var CheckBase64Image = (str) => {
    if (str === '' || str.trim() === '') { return false; }
    try {
        return isBase64(str, { allowMime: true })
    } catch (err) {
        return false;
    }
}

var isValidEmail = function (email) {
    const pattern = "^(\\s+)?\\w+([-+.']\\w+)*@[a-z0-9A-Z]+([-.][a-z0-9A-Z]+)*\\.[a-z0-9A-Z]+([-.][a-z0-9A-Z]+)*(\\s+)?$";
    return email.match(pattern);
}