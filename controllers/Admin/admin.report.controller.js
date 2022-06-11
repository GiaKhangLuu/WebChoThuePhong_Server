var messageRes = require('../../common/message.res');
const status_news = require('../../common/status.news');
var AuditLogSystem = require('../../common/audit.log');
var ReportNews = require('../../models/News/report.model');



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


}


var decoded = function (req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

