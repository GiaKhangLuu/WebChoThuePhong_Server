var express = require("express")
var router = express.Router()
var controller = require('../controllers/user.controller')


//################__Login___####################
router.post("/dang-nhap", controller.login);


//################__Register___####################
router.post("/dang-ky", controller.register);



router.get("/thong-tin", controller.getInforUser);
router.post("/xac-thuc/so-dien-thoai", controller.accuracyPhone_NB);
router.post("/xac-thuc/so-dien-thoai/ma-OTP", controller.accuracyPhone_NB_key_OTP);

router.get('/dang-xuat', controller.logout);
router.post('/doi-mat-khau', controller.ChangePassword);
router.post('/danh-gia', controller.FeedBack);
router.get('/danh-gia', controller.GetFeedBack);
router.get("/thong-tin/:id", controller.getInforUserById);
router.get("/chinh-sua-thong-tin", controller.getInforUserEdit);
router.post("/chinh-sua-thong-tin/anh-dai-dien", controller.UploadUserEditAvatar);
router.get("/open_image/nameimage=:nameimage", controller.OpenAvatarUser);
router.post("/chinh-sua-thong-tin-ca-nhan", controller.EditedInforUser);


module.exports = router;