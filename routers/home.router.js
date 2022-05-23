var express = require("express")
var router = express.Router()
var controller = require('../controllers/HomePage.controller')

router.get("/tin-tong-hop", controller.News_All);
router.get("/tin-phong-tro", controller.News_RoomHome);
router.get("/tin-nha-tro", controller.News_HouseHome);
router.get("/tin-can-ho", controller.News_ApartmentHome);
router.get("/thong-tin-chi-tiet/:id", controller.News_Detail);
router.get("/thong-tin-chi-tiet/city/:code_city", controller.GetNameCity);
router.get("/thong-tin-chi-tiet/dictrict/:code_dictrict", controller.GetNameDictrict);
router.post("/tin-tuc-lien-quan", controller.NewsNears);
router.get("/tin-tuc-noi-bat", controller.News_Special);

router.post("/bao-cao", controller.ReportNews);
router.post("/tim-kiem", controller.NewsFilter);



module.exports = router;



