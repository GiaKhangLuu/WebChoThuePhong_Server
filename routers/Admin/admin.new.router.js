var express = require("express")
var router = express.Router()
var controller= require('../../controllers/Admin/admin.new.controller')

router.get("/tin-tuc", controller.GetAllNews);
router.get("/cho-gui-duyet-tin-tuc", controller.GetPendingNews)
router.post("/chap-nhan-tin-tuc", controller.AcceptNews)

module.exports=router;
