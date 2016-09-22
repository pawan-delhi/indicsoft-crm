require('../models/userModel.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var bcrypt = require('bcrypt-nodejs');

var hashedPassword = bcrypt.hashSync("admin@123");
var userObj = {
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    role: 'Admin',
    email: 'super_admin',
    created_by: 'System (Auto generated)',
    isActive: true
};

// var client = require('twilio')('AC90e00d29f0b20d0395dd0c271183f16f', 'd5822cad1be751e776fe2fa902e8877f');
// client.sendSms({
//     to: '+918802793958',
//     from: '+1 205-390-7781',
//     body: 'Hi, Nazrul'
// }, function(error, message) {
//     console.log(error || message);
// });

userModel.findOne({ email: 'super_admin' }, function(err, result) {
    if (!result) {
        var saveUser = new userModel(userObj);
        saveUser.save(function() {});
    }
});