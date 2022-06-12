var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = require('../audit.log.model')
var today = new Date();
function FeebBackSchema(add) {
    var schema = new Schema(
        {
            feedback_sender: {
                type: String,
                required: true,
            },
            feedback_receiver: {
                type: String,
                required: true,
            },
            content_feedback: {
                type: String,
                required: true
            },
            rate: {
                type: Number
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
