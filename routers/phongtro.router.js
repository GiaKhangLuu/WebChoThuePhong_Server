var express = require("express")
var router = express.Router()
var controller = require('../controllers/phongtro.controller')
var authorize = require('../midleware/verify.token');
var role = require('../common/role');


//#########__Đăng tin upload_Image___##############
router.post("/dang-tin-moi/upload_image", controller.UploadAvarta);
router.get("/open_image/nameimage=:imagename", controller.getImageAvarta);
router.post("/dang-tin-moi/xoa-anh-dai-dien", controller.DeleteImageAvarta);

router.post("/dang-tin-moi/up-load_hinh-mo-ta", controller.UploadImageInfor);
router.post("/dang-tin-moi/xoa-anh-mo-ta", controller.DeleteImageInfor);

//#########__Đăng tin mới_Finish___##############
router.post("/dang-tin-moi", authorize(role.CHUNHATRO), controller.PostNews);




//################__Phong_Tro___####################

router.get("/quan-ly-tin-dang/phong-tro", authorize(role.CHUNHATRO), controller.PostManagerPT);
router.get("/quan-ly-tin-dang/nha-tro", authorize(role.CHUNHATRO), controller.PostManagerNT);
router.get("/quan-ly-tin-dang/can-ho", authorize(role.CHUNHATRO), controller.PostManagerCH);
router.post("/quan-ly-tin-dang/an-tin-tuc", authorize(role.CHUNHATRO), controller.PostManagerHiddenNews);





module.exports = router;

