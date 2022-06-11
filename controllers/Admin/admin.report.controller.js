var messageRes = require('../../common/message.res');
const status_news = require('../../common/status.news');
var AuditLogSystem = require('../../common/audit.log');
var ReportNews = require('../../models/News/report.model');
var News = require('../../models/News/news.model');
var MessageRes = require('../../common/message.res');
const mailer = require('../../utils/mailer');
const EmailCommon = require("../../common/email.constaint");
var jwt = require("jsonwebtoken");

module.exports.LoadReportNewsPending = async (req, res) => {
    var listReport = await ReportNews.find({ "status": status_news.PENDING })

    for (let i = 0; i < listReport.length; i++) {
        var news = await News.findOne({ "_id": listReport[i].idNews, "infor.status_news": status_news.ACCEPTED });
        if (news) {
            listReport[i].set("news", news, { strict: false });
        }
    }

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
    var news = await News.findOne({ "_id": detailReport.idNews, "infor.status_news": status_news.ACCEPTED });
    if (news) {
        detailReport.set("news", news, { strict: false });
    }
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

module.exports.DenyReportNews = async (req, res) => {
    var idReport = req.params.id;
    var token = decoded(req);
    try {

        var report = await ReportNews.findOne({ "_id": idReport, "status": status_news.PENDING });
        console.log(report);
        if (!report) {
            return res.status(404).json({
                data: detailReport,
                message: messageRes.INF_SUCCESSFULLY,
                result: false
            })
        }

        report.status = status_news.DENIED;
        report = AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, report);

        await mailer.sendMail(user.local.email, EmailCommon.EMAIL_REPORT_NEWS_SUBJECT, EmailCommon.EMAIL_REPORT_FAILED_NEWS_TEMPLATE);
        await report.save();

    } catch {
        return res.status(500).json({
            result: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }
}
module.exports.ConfirmReportNews = async (req, res) => {
    var { idReport, reason } = req.body;

    try {
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

        var user = await News.findOne({ "idReporter": report.idReporter });
        var news = await News.findOne({ _id: report.idNews });
        if (!news) {
            return res.status(404).json({
                success: true,
                message: messageRes.NEWS_NOT_FOUND,
                data: news_id
            })
        }
        news.infor.status_news = status_news.DELETE;
        news.reason = reason;
        AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, news)
        await mailer.sendMail(user.local.email, EmailCommon.EMAIL_REPORT_NEWS_SUBJECT, EmailCommon.EMAIL_REPORT_SUCCESSFULLY_NEWS_TEMPLATE);
        await report.save();
        await news.save();
        return res.status(200).json({
            success: true,
            message: messageRes.UPDATE_SUCCESSFULLY,
            data: news_id
        })

    }
    catch {
        return res.status(500).json({
            result: false,
            message: MessageRes.INTERVAL_SERVER
        })
    }
}


var decoded = function (req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

