var express = require("express")
var router = express.Router()
var controller = require('../controllers/phongtro.controller')
var authorize = require('../midleware/verify.token');
var role = require('../common/role');
const upload = require('../midleware/upload.image');

//#########__Đăng tin upload_Image___##############
router.post("/dang-tin-moi/upload_image", authorize(role.CHUNHATRO), controller.UploadAvarta);
router.get("/open_image/nameimage=:imagename", authorize(role.CHUNHATRO), controller.getImageAvarta);
router.post("/dang-tin-moi/xoa-anh-dai-dien", authorize(role.CHUNHATRO), controller.DeleteImageAvarta);

router.post("/dang-tin-moi/up-load_hinh-mo-ta", authorize(role.CHUNHATRO), controller.UploadImageInfor);
router.post("/dang-tin-moi/xoa-anh-mo-ta", authorize(role.CHUNHATRO), controller.DeleteImageInfor);

//#########__Đăng tin mới##############
const cpUpload = upload.fields([{ name: 'img_avatar', maxCount: 1 }, { name: 'img_infor', maxCount: 4 }])
router.post("/dang-tin-moi", authorize(role.CHUNHATRO), cpUpload, controller.PostNews);




//################__Phong_Tro___####################

router.get("/quan-ly-tin-dang/phong-tro", authorize(role.CHUNHATRO), controller.PostManagerPT);
router.get("/quan-ly-tin-dang/nha-tro", authorize(role.CHUNHATRO), controller.PostManagerNT);
router.get("/quan-ly-tin-dang/can-ho", authorize(role.CHUNHATRO), controller.PostManagerCH);
router.post("/quan-ly-tin-dang/an-tin-tuc", authorize(role.CHUNHATRO), controller.PostManagerHiddenNews);





module.exports = router;

