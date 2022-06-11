var messageRes = require('../../common/message.res');
const status_news = require('../../common/status.news');
var AuditLogSystem = require('../../common/audit.log');
var ReportNews = require('../../models/News/report.model');

var jwt = require("jsonwebtoken");

module.exports.LoadReportNewsPending = async (req, res) => {
    var listReport = await ReportNews.find({ "status": status_news.PENDING })

    if (!listReport) {
        return res.status(200).json({
            data: listReport,
            message: messageRes.REPORTS_NOT_FOUND,
            result: true
        })
    }

    return res.status(200).json({
        data: listReport,
        message: messageRes.INF_SUCCESSFULLY,
        result: true
    })
}

module.exports.DetailReportNews = async (req, res) => {
    var idReportNews = req.params.id;

    var detailReport = await ReportNews.findOne({ "_id": idReportNews });

    if (!detailReport) {
        return res.status(404).json({
            data: idReportNews,
            message: messageRes.REPORTS_NOT_FOUND,
            result: false
        })
    }

    return res.status(200).json({
        data: detailReport,
        message: messageRes.INF_SUCCESSFULLY,
        result: true
    })
}


module.exports.ConfirmReportNews = async (req, res) => {
    var { idReport, reason } = req.body;

    var token = decoded(req);
    var report = await Report.findOne({ "_id": idReport, "status": status_news.PENDING });

    if (!report) {
        return res.status(404).json({
            data: detailReport,
            message: messageRes.INF_SUCCESSFULLY,
            result: false
        })
    }

    report.status = status_news.ACCEPTED;
    report = AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, report);
    await report.save();

    var news = await News.findOne({ _id: report.idNews });
    if (!news) {
        return res.status(404).json({
            success: true,
            message: messageRes.NEWS_NOT_FOUND,
            data: news_id
        })
    }
    news.infor.status_news = status_news.DENIED;
    news.reason = reason;
    AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, news)
    await news.save();
    return res.status(200).json({
        success: true,
        message: messageRes.UPDATE_SUCCESSFULLY,
        data: news_id
    })


}


var decoded = function (req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

