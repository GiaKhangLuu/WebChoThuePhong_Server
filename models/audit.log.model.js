var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = new Schema({
    createtime: {
        type: Date,
        require: true
    },
    createbyname: {
        type: String
    },
    createbyid: {
        type: Schema.Types.ObjectId,
    },
    updatetime: {
        type: Date,
    },
    updatebyname: {
        type: String
    },
    updatebyid: {
        type: Schema.Types.ObjectId,
    },

});

module.exports = AuditLogSchema;


