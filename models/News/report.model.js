var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditLogSchema = require('../audit.log.model')
function ReportSchema(add) {
    var schema = new Schema(
        {
            idNews: {
                type: Schema.Types.ObjectId,
                ref: 'News',
                required: true,
            },
            idReporter: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
            },
            image: [{
                type: String
            }],
            status: {
                type: String
            }
        });
    if (add) {
        schema.add(add);
    }
    return schema;
};
var reportSchema = ReportSchema(AuditLogSchema);
module.exports = mongoose.model('Report', reportSchema, 'Report')
