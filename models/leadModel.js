var mongoose = require('mongoose');
var schema = mongoose.Schema;

var leadSchema = new schema({
    firstName: { type: String },
    lastName: { type: String },
    company: { type: String },
    mobile: { type: String },
    email: { type: String },
    status: { type: String },
    campaign: { type: String },
    priority: { type: String },
    address: { type: String },
    zip: { type: String },
    assignName: { type: String },
    assignId: { type: String },
    created_at: { type: Date, default: Date.now },
    lastEdited: { type: Date },
    editor: { type: String }
});

exports.leadModel = mongoose.model('leadModel', leadSchema);