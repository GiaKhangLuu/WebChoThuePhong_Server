const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = authorize;

function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        jwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
        (req, res, next) => {
            const authHeader = req.header('Authorization');
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access token not found"
                });
            }
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.CustomerId = decoded.CustomerId;
                next()
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Invalid token" })
            }
        }
    ];
}
