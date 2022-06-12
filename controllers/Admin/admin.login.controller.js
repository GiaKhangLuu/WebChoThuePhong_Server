const messageRes = require('../../common/message.res')
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
require('dotenv').config();
var User = require('../../models/User/user.model')
var role = require('../../common/role');

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
        if (!passwordValid)
            return res.status(400).json({
                success: false,
                message: messageRes.USERNAME_OR_PASSWORD_INCORRECT,

            });
        if (user.role != role.ADMIN) {
            return res.status(403).json({
                success: false,
                message: messageRes.FORBIDDEN_403,
            });
        }
        //Correct
        const accessToken = jwt.sign(
            { UserId: user._id, UserName: user.local.username, Role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
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