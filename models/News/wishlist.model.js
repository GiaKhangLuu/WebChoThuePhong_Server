var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = require('../audit.log.model')
function WishListSchema(add) {
    var schema = new Schema(
        {
            iduser: {
                type: String,
                required: true
            },
            idnews: {
                type: String,
                required: true
            },
        }
    );
    if (add) {
        schema.add(add);
    }
    return schema;
}

var wishListSchema = WishListSchema(AuditLogSchema.paths);
module.exports = mongoose.model('WishList', wishListSchema, 'WishList')
