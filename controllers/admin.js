require('../models/userModel.js');
require('../models/dropdownModel.js');
var mailer = require('../mailer.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var dropdownModel = mongoose.model('dropdownModel');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var pagination = require('mongoose-pagination');
var ejs = require('ejs');
var waterfall = require('async-waterfall');

exports.checkUser = function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, userResult) {
        if (userResult) {
            res.status(409).send();
        } else {
            return next();
        }
    });
};

exports.addUser = function(req, res) {
    var imageName = randomstring.generate(15);
    var activationToken = randomstring.generate(70);
    var imageData = req.body.userImage.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFile('./public/userImage/' + imageName + '.png', imageData, 'base64', function(err) {
        var imagePath = "http://" + req.headers.host + "/userImage/" + imageName + '.png';
        req.body.profileImage = imagePath;
        req.body.created_by = req.session.user.email;
        req.body.activationToken = activationToken;
        if (req.body.role == 'Executive') {
            req.body.manager = req.body.manager.firstName + ' ' + req.body.manager.lastName;
        }

        var saveUser = new userModel(req.body);

        saveUser.save(function(err, result) {
            if (!err) {
                res.status(201).send();
                var str = fs.readFileSync(process.cwd() + '/views/newAccountMail.ejs', 'utf8');
                var emailJSON = {
                    'userName': req.body.firstName + ' ' + req.body.lastName,
                    'accessUrl': 'http://' + req.headers.host + '/user-account-activate/' + activationToken
                };
                htmlContent = ejs.render(str, emailJSON);
                var mailOptions = {
                    from: 'ourncr00@gmail.com',
                    to: req.body.email,
                    subject: 'Account Creation',
                    text: '',
                    html: htmlContent
                };

                mailer.transporter.sendMail(mailOptions, function(error, info) {});
            }
        });
    });
};

exports.updateUser = function(req, res) {
    waterfall([
        function(callback) {
            if (req.body.profileImage.match(/base64/g)) {
                var imageName = randomstring.generate(15);
                var imageData = req.body.profileImage.replace(/^data:image\/\w+;base64,/, '');
                fs.writeFile('./public/userImage/' + imageName + '.png', imageData, 'base64', function(err) {
                    var imagePath = "http://" + req.headers.host + "/userImage/" + imageName + '.png';
                    req.body.profileImage = imagePath;
                    callback(null, req.body);
                });
            } else {
                callback(null, req.body);
            }
        }
    ], function(err, userObj) {
        if (userObj.role == 'Executive') {
            userObj.manager = userObj.manager.firstName + ' ' + userObj.manager.lastName;
        }
        userModel.update({ email: userObj.email }, {
            $set: userObj
        }, function(err, result) {
            if (result.n == 1) {
                res.status(201).send();
            } else {
                res.status(401).send();
            }
        });
    });
};

exports.addDropdown = function(req, res) {
    var saveDropdown = new dropdownModel({
        dname: req.body.name,
        created_by: req.session.user.email,
        type: req.body.type
    });

    saveDropdown.save(function(err) {
        if (!err) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    });
};

exports.userList = function(req, res) {
    userModel.find({}, { firstName: 1, lastName: 1, email: 1, created_at: 1, created_by: 1, role: 1, blocked: 1 })
        .paginate(req.query.page, 9, function(err, docs, total) {
            res.status(200).json({ total: total, result: docs });
        });
};

exports.userProfile = function(req, res) {
    userModel.findOne({ _id: req.query.id }, { password: 0, activationToken: 0 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.getManager = function(req, res) {
    userModel.find({ role: "Manager" }, { firstName: 1, lastName: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.getDepartmentList = function(req, res) {
    dropdownModel.find({}, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.getDropdownList = function(req, res) {
    dropdownModel.find({}, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.getManagerDepartment = function(req, res) {
    userModel.find({ _id: req.query.id }, { dname: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.searchUser = function(req, res) {
    userModel.find({ $text: { $search: req.query.search, } }, { firstName: 1, lastName: 1, email: 1, created_at: 1, created_by: 1, role: 1, isActive: 1, blocked: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.resetPassword = function(req, res) {
    var passwordToken = randomstring.generate(30);
    userModel.update({ email: req.query.email }, {
        $set: {
            passwordToken: passwordToken,
            passwordTokenExpired: false
        }
    }, function(err, result) {
        res.status(200).send();
        var str = fs.readFileSync(process.cwd() + '/views/passwordResetMail.ejs', 'utf8');
        var emailJSON = {
            'accessUrl': 'http://' + req.headers.host + '/reset-password/' + req.query.type + '/' + passwordToken
        };
        htmlContent = ejs.render(str, emailJSON);
        var mailOptions = {
            from: 'ourncr00@gmail.com',
            to: req.query.email,
            subject: 'Reset Password',
            text: '',
            html: htmlContent
        };

        mailer.transporter.sendMail(mailOptions, function(error, info) {});
    });
};

exports.deleteUser = function(req, res) {
    userModel.remove({ _id: req.query.id }, function(err) {
        if (!err) {
            res.status(200).send();
        } else {
            res.status(417).send();
        }
    });
};

exports.deleteDropdown = function(req, res) {
    dropdownModel.remove({ _id: req.query.id }, function(err) {
        if (!err) {
            res.status(200).send();
        } else {
            res.status(417).send();
        }
    });
};

exports.blockUser = function(req, res) {
    userModel.update({ _id: req.body.id }, {
        $set: {
            blocked: true
        }
    }, function(err) {
        if (!err) {
            res.status(201).send();
        } else {
            res.status(401).send();
        }
    });
};

exports.unblockUser = function(req, res) {
    userModel.update({ _id: req.body.id }, {
        $set: {
            blocked: false
        }
    }, function(err) {
        if (!err) {
            res.status(201).send();
        } else {
            res.status(401).send();
        }
    });
};