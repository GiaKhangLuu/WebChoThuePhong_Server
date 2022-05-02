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
            role: {
                type: String,
                default: 'MEMBER'
            },
            number_phone: {
                type: Number,
                default: ''
            },
            isEmailComfirm: {
                type: Boolean,
                default: false
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