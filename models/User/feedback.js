var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = require('../audit.log.model')

function FeebBackSchema(add) {
    var schema = new Schema(
        {
            iduser: {
                type: String,
                required: true
            },
            titelfeedback: {
                type: String,
                required: true
            },
            contentfeedback: {
                type: String,
                required: true
            },
            timefeedback: {
                type: Date,
                default: today
            }

        }
    );
    if (add) {
        schema.add(add);
    }
    return schema;
}

var feedBackSchema = FeebBackSchema(AuditLogSchema.paths);
module.exports = mongoose.model('FeedBack', feedBackSchema, 'FeedBack')
