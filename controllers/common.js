require('../models/userModel.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

exports.login = function(req, res, next) {
    if (req.body) {
        userModel.findOne({ email: req.body.email }, function(err, result) {
            if (result) {
                if (result.blocked === true || result.isActive === false) {
                    res.status(423).send({ message: 'Sorry! your account has been suspended or not activated' });
                } else {
                    var checkPassword = bcrypt.compareSync(req.body.password, result.password);
                    if (checkPassword) {
                        req.session.user = result;
                        res.status(200).json({ role: result.role });
                        return next();
                    } else {
                        res.status(401).send({ message: 'The username and password you entered don\'t match. ' });
                    }
                }
            } else {
                res.status(401).json({ message: 'Sorry, Server doesn\'t recognize that username' });
            }
        });
    }
};

exports.sessionCheck = function(req, res) {
    if (req.session.user) {
        res.status(200).json({ role: req.session.user.role });
    } else {
        res.status(401).send();
    }
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (!err) {
            res.status(200).send();
        } else {
            res.status(401).send();
        }
    });
};

exports.userAccountActivate = function(req, res) {
    req.session.destroy(function(err) {});
    userModel.findOne({ activationToken: req.query.token }, function(err, result) {
        if (result) {
            if (result.isActive === false) {
                res.status(200).json({ email: result.email, role: result.role });
            } else {
                res.status(498).send();
            }
        } else {
            res.status(498).send('expired or invalid token');
        }
    });
};

exports.userAccountCreation = function(req, res, next) {
    var hashedPassword = bcrypt.hashSync(req.body.password);
    userModel.update({ email: req.body.email }, {
        $set: {
            username: req.body.email,
            password: hashedPassword,
            isActive: true
        }
    }, function(err, result) {
        if (!err) {
            return next();
        }
    });
};

exports.getResetPassword = function(req, res) {
    req.session.destroy(function(err) {});
    if (req.query.type == 'user') {
        userModel.findOne({ passwordToken: req.query.token }, { email: 1, passwordTokenExpired: 1, _id: 0, firstName: 1 }, function(err, result) {
            if (result) {
                if (result.passwordTokenExpired === false) {
                    res.status(200).json({ result: result, type: req.query.type });
                } else {
                    res.status(498).send();
                }
            } else {
                res.status(498).send();
            }
        });
    }
};

exports.saveResetPassword = function(req, res) {
    if (req.body.type == 'user') {
        var hashedPassword = bcrypt.hashSync(req.body.password);
        userModel.update({ email: req.body.email }, {
            $set: {
                password: hashedPassword,
                passwordTokenExpired: true
            }
        }, function(err, result) {
            if (result.n == 1) {
                res.status(201).send();
            } else {
                res.json(417).send();
            }
        });
    }
};