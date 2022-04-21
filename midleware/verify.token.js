const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = authorize;

function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            const authHeader = req.header('Authorization');
            const token = authHeader && authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access token not found"
                });
            }
            if (roles.length && !roles.includes(decoded.Role)) {
                return res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập' });
            }
            try {

                req.UserId = decoded.UserId;
                next()
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Invalid token" })
            }
        }
    ];
}
