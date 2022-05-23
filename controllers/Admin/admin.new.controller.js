const path = require("path");
const multer = require("multer");
const fs = require("fs");

var Comment = require('../../models/News/comment');
var News = require('../../models/News/news.model');
var TypeNews = require('../../models/News/typenews.model');
var messageRes = require('../../common/message.res');
const status_news = require('../../common/status.news');
var AuditLogSystem = require('../../common/audit.log');
//################ Get all news ###########
module.exports.GetAllNews = async (req, res) => {
  let news = await News.find()
  res.json({
    news: news
  })
}

//############ Get detail news ##############
module.exports.GetDetailById = async (req, res) => {
  let news = await News.findOne({ "_id": req.params.id });
  if (news == null) {
    return res.status(404).json({
      success: false,
      message: messageRes.NEWS_NOT_FOUND,
      data: req.params._id
    })
  }
  return res.status(200).json({
    success: true,
    message: messageRes.INF_SUCCESSFULLY,
    data: news
  })
}
//################ Get all cho chap nhan news ###########
module.exports.GetPendingNews = async (req, res) => {
  let news = await News.find({
    'infor.status_news': 'Chờ gửi duyệt'
  }).exec()
  res.json({
    success: true,
    message: messageRes.INF_SUCCESSFULLY,
    news: news
  })
}


//################ Accept news  ###########
module.exports.AcceptNews = async (req, res) => {
  let news_id = req.body._id;
  var token = decoded(req);

  if (reason == null || reason == undefined) {
    return res.status(400).json({
      success: true,
      message: "Lý do từ chối không được bỏ trống",
      data: news_id
    })
  }
  var news = await News.findOne({ _id: news_id });
  if (news == null) {
    return res.status(404).json({
      success: true,
      message: messageRes.NEWS_NOT_FOUND,
      data: news_id
    })
  }
  if (news.infor.status_news != status_news.PENDING) {
    return res.status(400).json({
      success: true,
      message: messageRes.NEWS_NOT_FOUND,
      data: news_id
    })
  }
  news.infor.status_news = status_news.ACCEPTED;
  AuditLogSystem.SetUpdateInfo(token.UserId, token.UserName, news)
  await news.save();
  return res.status(200).json({
    success: true,
    message: messageRes.UPDATE_SUCCESSFULLY,
    data: news_id
  })

}


//################ Deny news  ###########
module.exports.DenyNews = async (req, res) => {
  let news_id = req.body._id
  var token = decoded(req);
  let reason = req.body.reason;
  var news = await News.findOne({ _id: news_id });
  if (news == null) {
    return res.status(404).json({
      success: true,
      message: messageRes.NEWS_NOT_FOUND,
      data: news_id
    })
  }
  if (news.infor.status_news != status_news.PENDING) {
    return res.status(400).json({
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