var express = require("express")
var router = express.Router()
var controller = require('../../controllers/Admin/admin.new.controller')
var loginController = require('../../controllers/Admin/admin.login.controller')
var reportController = require('../../controllers/Admin/admin.report.controller')
var authorize = require('../../midleware/verify.token');
var role = require('../../common/role');


router.get("/tin-tuc", authorize(role.ADMIN), controller.GetAllNews);
router.get("/cho-gui-duyet-tin-tuc", authorize(role.ADMIN), controller.GetPendingNews)
router.get("/chi-tiet-tin-tuc/:id", authorize(role.ADMIN), controller.GetDetailById);
router.post("/chap-nhan-tin-tuc", authorize(role.ADMIN), controller.AcceptNews)
router.post("/tu-choi-tin-tuc", authorize(role.ADMIN), controller.DenyNews)


//report
router.get("/danh-sach-bao-cao", authorize(role.ADMIN), reportController.LoadReportNewsPending);
router.get("/chi-tiet-bao-cao/:id", authorize(role.ADMIN), reportController.DetailReportNews);
router.post("/xac-nhan-bao-cao", authorize(role.ADMIN), reportController.ConfirmReportNews);
router.post("/tu-choi-bao-cao/:id", authorize(role.ADMIN), reportController.DenyReportNews);


//login
router.post('/dang-nhap', loginController.login);
module.exports = router;
