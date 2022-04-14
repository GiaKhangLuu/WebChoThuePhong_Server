var express = require("express")
var router = express.Router()
var controller= require('../controllers/phongtro.controller')


//################__Đăng tin mới_Address___####################
router.post("/dang-tin-moi/chon-tinhTP",controller.citys);
router.get("/dang-tin-moi/danh-sach-duong/:code_city",controller.StreetstoCitys);
router.post("/dang-tin-moi/chon-QH",controller.districts);
router.post("/dang-tin-moi/chon-Duong",controller.streets);


   //#########__Đăng tin upload_Image___##############
router.post("/dang-tin-moi/upload_image",controller.UploadAvarta);
router.get("/open_image/nameimage=:imagename",controller.getImageAvarta);
router.post("/dang-tin-moi/xoa-anh-dai-dien",controller.DeleteImageAvarta);

router.post("/dang-tin-moi/up-load_hinh-mo-ta",controller.UploadImageInfor);
router.post("/dang-tin-moi/xoa-anh-mo-ta",controller.DeleteImageInfor);

//#########__Đăng tin mới_Finish___##############
router.post("/dang-tin-moi/phong-tro",controller.PostNewsPT);
router.post("/dang-tin-moi/nha-tro",controller.PostNewsNT);
router.post("/dang-tin-moi/can-ho",controller.PostNewsCH);



//################__Phong_Tro___####################

router.get("/quan-ly-tin-dang/phong-tro",controller.PostManagerPT);
router.get("/quan-ly-tin-dang/nha-tro",controller.PostManagerNT);
router.get("/quan-ly-tin-dang/can-ho",controller.PostManagerCH);
router.post("/quan-ly-tin-dang/an-tin-tuc-phong-tro",controller.PostManagerHiddenNewsPT);
router.post("/quan-ly-tin-dang/an-tin-tuc-nha-tro",controller.PostManagerHiddenNewsNT);
router.post("/quan-ly-tin-dang/an-tin-tuc-can-ho",controller.PostManagerHiddenNewsCH);




module.exports=router;

