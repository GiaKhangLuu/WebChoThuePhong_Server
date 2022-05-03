
var rn = require('random-number'); // library ramdom number 
var Nexmo = require('nexmo'); // library send OTP
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const messageRes = require('../common/message.res')
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
require('dotenv').config();
var User = require('../models/User/user.model')
var FeedBack = require('../models/User/feedback')
const AuditLogSystem = require('../common/audit.log');
const EmailCommon = require("../common/email.constaint");
const mailer = require('../utils/mailer');
const role = require('../common/role');

//###########__Login__#####################
module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ "local.username": username });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: messageRes.USERNAME_OR_PASSWORD_INCORRECT,
            })
        }
        const passwordValid = await argon2.verify(user.local.password, password);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: messageRes.USERNAME_OR_PASSWORD_INCORRECT,

            });
        }


        if (!user.isEmailComfirm) {
            return res.status(400).json({
                success: false,
                message: messageRes.EMAIL_IS_NOT_CONFIRM,
            });
        }

        //Correct
        const accessToken = jwt.sign(
            { UserId: user._id, UserName: user.local.username, Role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10h" }
        );
        const refreshToken = jwt.sign(
            { UserId: user._id, UserName: user.local.username, Role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: messageRes.LOGIN_SUCCESSFULLY,
            data: {
                accessToken,
                refreshToken
            }
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: messageRes.INTERVAL_SERVER })
    };
};

//###########__Register__###################
module.exports.register = async (req, res) => {
    const { username, password, email, firstname, lastname,
        gender, city, district, street, address_detail } = req.body;

    try {
        var user = await User.findOne({ "local.username": username });
        //Check for existing user
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: messageRes.EMAIL_INCORRECT_FORMAT
            });
        }

        if (user)
            return res.status(400).json({
                success: false,
                message: messageRes.USERNAME_ALREADY_TAKEN
            });

        user = await User.findOne({ "local.email": email });
        if (user)
            return res.status(400).json({
                success: false,
                message: messageRes.EMAIL_ALREADY_TAKEN
            })

        const hashedPassword = await argon2.hash(password);
        //create new User
        var newUser = new User({
            "local.username": username,
            "local.password": hashedPassword,
            "local.email": email,
            "infor.firstname": firstname,
            "infor.lastname": lastname,
            "infor.gender": gender,
            "address.city": city,
            "address.district": district,
            "address.street": street,
            "address.address_detail": address_detail,
        });

        if (newUser.infor.gender) {
            newUser.infor.img_avatar = process.env.URL_IMAGE_FEMALE
        } else newUser.infor.img_avatar = process.env.URL_IMAGE_MALE

        await newUser.save();

        //set audit log Create
        newUser = AuditLogSystem.SetCreateInfo(newUser._id, newUser.local.username, newUser);
        await newUser.save();

        await mailer.sendMail(email, EmailCommon.EMAIL_REGISTER_SUBJECT, EmailCommon.EMAIL_REGISTER_TEMPLATE);
        return res.status(200).json({
            success: true,
            message: messageRes.REGISTER_SUCCESSFULLY,
            data: newUser._id
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: messageRes.INTERVAL_SERVER })
    }
};

module.exports.comfirmEmail = async (req, res) => {

    try {
        var { idUser } = req.body;
        var user = await User.findOne({ _id: idUser });

        if (!user) {
            return res.status(404).json({
                result: false,
                message: messageRes.USERNAME_NOT_FOUND
            })
        }

        user.isEmailComfirm = true
        user = AuditLogSystem.SetUpdateInfo(user._id, user.local.username, user);
        await user.save();

        return res.status(200).json({
            result: true,
            message: messageRes.INF_SUCCESSFULLY
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            result: false,
            message: messageRes.INTERVAL_SERVER
        })
    }
}
//
module.exports.getInforUser = async (req, res) => {

    var token = decoded(req)
    await User.findOne({ "_id": token.UserId }, (err, user) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: messageRes.USERNAME_NOT_FOUND,
                data: null
            })
        };
        if (user.role === "MEMBER") {
            user.role = "THÀNH VIÊN"
        }
        if (user.role === "CHUNHATRO") {
            user.role = "CHỦ NHÀ TRỌ"
        }
        user.local.password = "**********";
        return res.json({
            success: true,
            message: messageRes.INF_SUCCESSFULLY,
            data: user
        })
    })
};
//  Accuracy(Xác thực) send Email

module.exports.accuracyEmail = async (req, res) => {

    var token = decoded(req);
    var user = await User.findOne({ "_id": token.UserId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: messageRes.USERNAME_NOT_FOUND,

        })
    }

    if (!user.isEmailComfirm) {
        return res.status(400).json({
            success: false,
            message: messageRes.EMAIL_IS_NOT_CONFIRM,

        })
    }

    await mailer.sendMail(user.local.email, EmailCommon.EMAIL_POST_NEWS_SUBJECT, EmailCommon.EMAIL_POST_NEWS_TEMPLATE);
    return res.status(200).json({
        success: true,
        message: messageRes.INF_SUCCESSFULLY
    })
};

module.exports.ConfirmEmailNews = async (req, res) => {

    var token = decoded(req);
    var user = await User.findOne({ "_id": token.UserId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: messageRes.USERNAME_NOT_FOUND,

        })
    }

    if (!user.isEmailComfirm) {
        return res.status(400).json({
            success: false,
            message: messageRes.EMAIL_IS_NOT_CONFIRM,

        })
    }
    user.role = role.CHUNHATRO
    var namerole = "";
    if (user.role === "CHUNHATRO") {
        namerole = "CHỦ NHÀ TRỌ"
    }
    user = await AuditLogSystem.SetUpdateInfo(user._id, user.local.username, user);
    await user.save();

    return res.status(200).json({
        success: true,
        message: messageRes.INF_SUCCESSFULLY,
        data: namerole
    })
};

// Đổi mật khẩu
module.exports.ChangePassword = async (req, res) => {
    if (req.isAuthenticated()) {
        let { password, passwordold } = req.body;
        await bcrypt.compare(passwordold, req.user.local.password, (err, isMacth) => {
            if (err) {
                console.log(err);
            }
            if (!isMacth) {
                res.json({
                    result: false,
                    message: "Đổi mật khẩu thất bại!!"
                })
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) throw err;
                    User.findByIdAndUpdate({ "_id": req.user.id }, { "local.password": hash }, (err) => {
                        if (err) console.log(err);
                        res.json({
                            message: "Đổi mật khẩu thành công!!",
                            result: true
                        })
                    })

                });
            }



        });

    } else {
        res.json({
            message: "Bạn cần phải đăng nhập để thực hiện chức năng này",
            result: false
        });
    }
}

// User FeedBack (Người dùng đánh giá)
module.exports.FeedBack = async (req, res) => {
    if (req.isAuthenticated()) {
        let { titelfeedback, contentfeedback } = req.body;
        let feedback = new FeedBack();
        feedback.titelfeedback = titelfeedback;
        feedback.contentfeedback = contentfeedback;
        feedback.iduser = req.user.id;
        feedback.save(err => {
            if (err) console.log(err);
            res.json({
                message: "Đánh giá thành công!! PhongTRoVN sẽ ghi nhận ý kiến của bạn",
                result: true
            });
        })
    } else {
        res.json({
            message: "Bạn cần phải đăng nhập để thực hiện chức năng này",
            result: false
        });
    }
}
// Get list FeedBack to database
module.exports.GetFeedBack = async (req, res) => {
    try {
        await FeedBack.find().sort({ "infor.date_now": -1 }).limit(6).exec(
            (err, result) => {
                if (err) console.log(err);
                res.json({
                    feedbacks: result
                })
            })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}

// get Info User By Id (Lấy thông tin user từ id)
module.exports.getInforUserById = async (req, res) => {
    try {
        await User.findOne({ "_id": req.params.id }, (err, user) => {
            if (err) console.log(err);
            let namerole = "Không xác định"
            if (user.role === "MEMBER") {
                namerole = "THÀNH VIÊN"
            }
            if (user.role === "CHUNHATRO") {
                namerole = "CHỦ NHÀ TRỌ"
            }
            let usered = {
                id: user.id,
                firstname: user.infor.firstname,
                lastname: user.infor.lastname,
                role: namerole,
                number_phone: user.number_phone
            }
            res.json({
                user: usered
            })
        })
    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}

//  Edit profile User
module.exports.getInforUserEdit = async (req, res) => {
    var token = decoded(req);
    var user = await User.findOne({ "_id": token.UserId });

    if (!user) {
        return res.status(404).json({
            result: false,
            message: messageRes.USERNAME_NOT_FOUND
        })
    }

    return res.status(200).json({
        result: true,
        message: messageRes.INF_SUCCESSFULLY,
        data: user
    })
}

// Upload image user avatar
const storageuser = multer.diskStorage({
    destination: "./public/uploads_user_av/",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const uploadAvatarUser = multer({
    storage: storageuser,
    limits: { fileSize: 1000000 },
}).single("file");

module.exports.UploadUserEditAvatar = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            await uploadAvatarUser(req, res, (err) => {
                if (err) {
                    console.log(err);
                    res.json({
                        result: false,
                        message_err: "Không thể upload Ảnh"
                    })
                };
                res.json({
                    result: true,
                    filename_avatar: req.file.filename
                });
            });
        } else {
            res.json({
                message: "Bạn không có quyền này",
                result: false
            });
        }
    } catch (err) {
        console.log(err);

        res.json({
            result: false,
            message_err: "Không thể upload Ảnh"
        });
    }

}

module.exports.OpenAvatarUser = async (req, res) => {
    let imagename = "public/uploads_user_av/" + req.params.nameimage;
    await fs.readFile(imagename, (err, ImageData) => {
        if (err) res.json({
            result: false,
            message_err: "Lỗi không thể load ảnh"
        });
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(ImageData);
    })
}


// Summit Edit Infor User

module.exports.EditedInforUser = async (req, res) => {
    try {
        let { firstname, lastname, gender, password } = req.body;
        const token = decoded(req);

        var user = await User.findOne({ "_id": token.UserId });
        if (!user) {
            return res.status(404).json({
                result: false,
                message: messageRes.USERNAME_NOT_FOUND
            })
        }



    } catch (err) {
        res.json({
            result: false,
            message: err
        })
    }
}

var isValidEmail = function (email) {
    const pattern = "^(\\s+)?\\w+([-+.']\\w+)*@[a-z0-9A-Z]+([-.][a-z0-9A-Z]+)*\\.[a-z0-9A-Z]+([-.][a-z0-9A-Z]+)*(\\s+)?$";
    return email.match(pattern);
}

var decoded = function (req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
