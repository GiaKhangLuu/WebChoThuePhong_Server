var express = require("express")
var router = express.Router()
var passport = require('passport')
var controller= require('../controllers/user.controller')


//################__Login___####################
router.get("/dang-nhap",controller.login);
router.get("/dang-nhap-thanh-cong",controller.loginsuccess);
router.post("/dang-nhap",
passport.authenticate('local.login',{
    successRedirect: '/nguoi-dung/dang-nhap-thanh-cong',
    failureRedirect: '/nguoi-dung/dang-nhap',
    failureFlash: true })
);


//################__Register___####################
router.post("/dang-ky",
passport.authenticate('local.register', { 
    successRedirect: '/nguoi-dung/dang-ky-thanh-cong',
    failureRedirect: '/nguoi-dung/dang-ky',
    failureFlash: true })
);
router.get("/dang-ky-thanh-cong",controller.registersuccess);
router.get("/dang-ky",controller.register);

router.get("/thong-tin",controller.getInforUser);
router.post("/xac-thuc/so-dien-thoai",controller.accuracyPhone_NB);
router.post("/xac-thuc/so-dien-thoai/ma-OTP",controller.accuracyPhone_NB_key_OTP);

router.get('/dang-xuat',controller.logout);
router.post('/doi-mat-khau',controller.ChangePassword);
router.post('/danh-gia',controller.FeedBack);
router.get('/danh-gia',controller.GetFeedBack);
router.get("/thong-tin/:id",controller.getInforUserById);
router.get("/chinh-sua-thong-tin",controller.getInforUserEdit);
router.post("/chinh-sua-thong-tin/anh-dai-dien",controller.UploadUserEditAvatar);
router.get("/open_image/nameimage=:nameimage",controller.OpenAvatarUser);
router.post("/chinh-sua-thong-tin-ca-nhan",controller.EditedInforUser);


module.exports=router;

