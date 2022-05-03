var express = require("express")
var router = express.Router()
var controller = require('../controllers/user.controller')
var authorize = require('../midleware/verify.token');
var role = require('../common/role');

//################__Login___####################
router.post("/dang-nhap", controller.login);


//################__Register___####################
router.post("/dang-ky", controller.register);
router.post("/tai-khoan/kich-hoat", controller.comfirmEmail);


router.get("/thong-tin", authorize([role.CHUNHATRO, role.MEMBER]), controller.getInforUser);
router.post("/xac-thuc/gui-email", authorize([role.MEMBER]), controller.accuracyPhone_NB);
router.post("/xac-thuc/xac-nhan-email", authorize([role.MEMBER]), controller.accuracyPhone_NB);



router.post('/doi-mat-khau', controller.ChangePassword);
router.post('/danh-gia', controller.FeedBack);
router.get('/danh-gia', controller.GetFeedBack);
router.get("/thong-tin/:id", controller.getInforUserById);
router.get("/chinh-sua-thong-tin", authorize([role.CHUNHATRO, role.MEMBER]), controller.getInforUserEdit);
router.post("/chinh-sua-thong-tin/anh-dai-dien", controller.UploadUserEditAvatar);
router.get("/open_image/nameimage=:nameimage", controller.OpenAvatarUser);
router.post("/chinh-sua-thong-tin", controller.EditedInforUser);


module.exports = router;