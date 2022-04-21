var express = require("express")
var router = express.Router()
var controller = require('../../controllers/Admin/admin.new.controller')
var loginController = require('../../controllers/Admin/admin.login.controller')
var authorize = require('../../midleware/verify.token');
var role = require('../../common/role');


router.get("/tin-tuc", authorize(role.ADMIN), controller.GetAllNews);
router.get("/cho-gui-duyet-tin-tuc", authorize(role.ADMIN), controller.GetPendingNews)
router.get("/chi-tiet-tin-tuc/:id", authorize(role.ADMIN), controller.GetDetailById);
router.post("/chap-nhan-tin-tuc", authorize(role.ADMIN), controller.AcceptNews)
router.post("/tu-choi-tin-tuc", authorize(role.ADMIN), controller.DenyNews)

//login
router.post('/dang-nhap', loginController.login);
module.exports = router;
