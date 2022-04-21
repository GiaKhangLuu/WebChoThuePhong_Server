var express = require("express")
var router = express.Router()
var controller = require('../../controllers/Admin/admin.new.controller')
var authorize = require('../../midleware/verify.token');
var role = require('../../common/role');


router.get("/tin-tuc", authorize(role.ADMIN), controller.GetAllNews);
router.get("/cho-gui-duyet-tin-tuc", authorize(role.ADMIN), controller.GetPendingNews)
router.post("/chap-nhan-tin-tuc", authorize(role.ADMIN), controller.AcceptNews)
router.post("/tu-choi-tin-tuc", authorize(role.ADMIN), controller.DenyNews)

module.exports = router;
