var express = require("express")
var router = express.Router()
var messageController = require('../../controllers/Messages/message.controller')
var authorize = require('../../midleware/verify.token');
var role = require('../../common/role');

router.post("/tai-tin-nhan", messageController.LoadOldMessages)
router.post("/tai-room", messageController.LoadRooms)

//login
module.exports = router;
