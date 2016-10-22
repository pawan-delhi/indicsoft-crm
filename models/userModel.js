var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    email: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    profileImage: { type: String },
    role: { type: String },
    manager: { type: String },
    dname: { type: String },
    blocked: { type: Boolean, default: false },
    lastLogin: { type: Date },
    created_by: { type: String },
    created_at: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    loggedIn: { type: Boolean, default: false },
    activationToken: { type: String },
    passwordToken: { type: String },
    passwordTokenExpired: { type: Boolean }
});

userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

exports.userModel = mongoose.model('userModel', userSchema);