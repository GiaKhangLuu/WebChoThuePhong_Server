var express = require("express")
var router = express.Router()
var feedbackController = require('../controllers/feedback.controller')

router.post("/hien-danh-sach-danh-gia", feedbackController.ShowFeedBackReceiver)
router.post('/gui-danh-gia', feedbackController.SendFeedback)
router.post('/lay-feedback', feedbackController.GetFeedBack)

module.exports = router;
