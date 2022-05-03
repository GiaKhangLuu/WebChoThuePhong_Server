var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateEmailSchema = new Schema(
    {
        key: {
            type: String
        },
        htmlContent: {
            type: String
        }

    }
);

module.exports = mongoose.model('TemplateEmail', TemplateEmailSchema, 'TemplateEmail');