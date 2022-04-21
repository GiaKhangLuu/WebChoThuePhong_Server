const path = require("path");
const multer = require("multer");
const fs=require("fs");

var Comment = require('../../models/News/comment');
var News = require('../../models/News/news.model');
var TypeNews =require('../../models/News/typenews.model');


//################ Get all news ###########
module.exports.GetAllNews = async (req ,res) => {
  let news = await News.find()
  res.json({
    news: news
  }) 
}


//################ Get all cho chap nhan news ###########
module.exports.GetPendingNews = async (req, res) => {
  let news = await News.find({
    'infor.status_news': 'Chờ gửi duyệt'
  }).exec()
  res.json({
    news: news
  })
}


//################ Accept news  ###########
module.exports.AcceptNews = async (req, res) => {
  let news_id = req.body._id
  let news = await News.findOneAndUpdate(
    { _id: news_id }, 
    { $set: { "infor.status_news": "Chấp nhận" } },
    { new: true }
  ).exec()
  res.json({
    news: news
  })
}


//################ Deny news  ###########
module.exports.DenyNews = async (req, res) => {
  let news_id = req.body._id
  let news = await News.findOneAndUpdate(
    { _id: news_id }, 
    { $set: { "infor.status_news": "Từ chối" } },
    { new: true }
  ).exec()
  res.json({
    news: news
  })
}
