var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = require('../audit.log.model')
function UserSchema(add) {
    var schema = new Schema(
        {
            infor: {
                firstname: {
                    type: String,
                    required: true
                },
                lastname: {
                    type: String,
                    required: true
                },
                gender: {
                    type: Boolean
                },
                img_avatar: {
                    type: String,
                    default: ''
                }
            },
            local: {
                username: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
            },
            address: {
                city: {
                    type: String,
                    required: true
                },
                district: {
                    type: String,
                    required: true
                },
                street: {
                    type: String,
                    required: true
                },
                address_detail: {
                    type: String,
                    required: true
                }
            },
            role: {
                type: String,
                default: 'MEMBER'
            },
            number_phone: {
                type: String,
                default: ''
            },
            isEmailComfirm: {
                type: Boolean,
                default: false
            },
            refreshToken: {
                type: String
            }
        }
    );
    if (add) {
        schema.add(add);
    }
    return schema;
}

var userSchema = UserSchema(AuditLogSchema.paths);
module.exports = mongoose.model('User', userSchema, 'User')
