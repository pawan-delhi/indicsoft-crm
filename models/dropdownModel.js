var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dropdownSchema = new schema({
    dname: { type: String },
    created_by: { type: String },
    type: { type: String }
});

exports.dropdownModel = mongoose.model('dropdownModel', dropdownSchema);