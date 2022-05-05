
var News = require('../models/News/news.model');
var MessageRes = require('../common/message.res');
var StatusNews = require('../common/status.news');

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
        const news = await News.find({ "_id": req.params.id });
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
        await News.find({ "address.code_city": req.params.code_city, "address.code_dictrict": req.params.code_dictrict }, (err, result) => {
            if (err) console.log(err);
            res.json({
                NewsNears: result
            })
        })
    } catch (err) {
        res.json({
            result: false,
            NewsNears: '',
            message: err
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



