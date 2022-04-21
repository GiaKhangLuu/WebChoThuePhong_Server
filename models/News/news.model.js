var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var today = new Date();
var AuditLogSchema = require('../audit.log.model')
function NewsSchema(add) {
    var schema = new Schema(
        {
            infor: {
                iduser: {
                    type: String,
                    required: true
                },
                title: {
                    type: String,
                    required: true
                },
                content_infor: {
                    type: String,
                    required: true
                },
                number_phone: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                acreage: {
                    type: Number,
                    required: true
                },
                typehome: {
                    type: Number,
                    required: true
                },
                nb_bedroom: {
                    type: Number,
                    default: 1
                },
                nb_bath_toilet: {
                    type: Number,
                    default: 1
                },
                nb_kitchenroom: {
                    type: Number,
                    default: 1
                },
                status_news: {
                    type: String,
                }
            },

            utilities: {
                isChecked_wifi: {
                    type: Boolean,
                    default: false
                },
                isChecked_mezzanine: {
                    type: Boolean,
                    default: false
                },
                isChecked_camera: {
                    type: Boolean,
                    default: false
                },
                isChecked_parking: {
                    type: Boolean,
                    default: false
                }, isChecked_fridge: {
                    type: Boolean,
                    default: false
                },
                isChecked_WashingMachine: {
                    type: Boolean,
                    default: false
                },
                isChecked_television: {
                    type: Boolean,
                    default: false
                },
                isChecked_AirConditional: {
                    type: Boolean,
                    default: false
                }, isChecked_elevator: {
                    type: Boolean,
                    default: false
                },
                isChecked_pool: {
                    type: Boolean,
                    default: false
                },
                isChecked_park: {
                    type: Boolean,
                    default: false
                },
                isChecked_mattress: {
                    type: Boolean,
                    default: false
                }
            },
            img_avatar: {
                type: Buffer,
                required: true,
            },
            img_infor: [{
                type: Buffer,
                required: true,
            }],
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
            }
        });
    if (add) {
        schema.add(add);
    }
    return schema;
};
var newsSchema = NewsSchema(AuditLogSchema);
module.exports = mongoose.model('News', newsSchema, 'News')
