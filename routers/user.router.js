var express = require("express")
var router = express.Router()
var controller = require('../controllers/user.controller')
var authorize = require('../midleware/verify.token');
var role = require('../common/role');

//################__Login___####################
router.post("/dang-nhap", controller.login);
router.post("/refresh-token", controller.refreshToken);

//################__Register___####################
router.post("/dang-ky", controller.register);
router.post("/tai-khoan/kich-hoat", controller.comfirmEmail);


router.get("/thong-tin", authorize([role.CHUNHATRO, role.MEMBER]), controller.getInforUser);
router.post("/xac-thuc/gui-email", authorize([role.MEMBER]), controller.accuracyEmail);
router.post("/xac-thuc/xac-nhan-email", authorize([role.MEMBER]), controller.ConfirmEmailNews);



router.post('/doi-mat-khau', controller.ChangePassword);
router.post('/danh-gia', controller.FeedBack);
router.get('/danh-gia', controller.GetFeedBack);
router.get("/thong-tin/:id", controller.getInforUserById);
router.get("/chinh-sua-thong-tin", authorize([role.CHUNHATRO, role.MEMBER]), controller.getInforUserEdit);
router.post("/chinh-sua-thong-tin/anh-dai-dien", authorize([role.CHUNHATRO, role.MEMBER]), controller.UploadUserEditAvatar);
router.post("/chinh-sua-thong-tin", controller.EditedInforUser);
router.post("/yeu-thich-tin/:id", controller.WishList);

router.get('/tin-yeu-thich', controller.GetAllWishList);
router.get('/tin-yeu-thich/:id', controller.GetDetailWishList);

module.exports = router;