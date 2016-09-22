var mongoose = require('mongoose');
var schema = mongoose.Schema;

var noteSchema = new schema({
    leadId: { type: String },
    title: { type: String },
    actorId: { type: String },
    actor: { type: String },
    action: { type: String },
    message: { type: String },
    noteType: { type: String },
    noteDate: { type: Date, default: Date.now }
});

exports.noteModel = mongoose.model('noteModel', noteSchema);