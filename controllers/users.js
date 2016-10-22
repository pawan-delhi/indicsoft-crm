require('../models/userModel.js');
require('../models/leadModel.js');
require('../models/noteModel.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var leadModel = mongoose.model('leadModel');
var noteModel = mongoose.model('noteModel');
var crypto = require('crypto');
var waterfall = require('async-waterfall');


exports.userDetails = function(req, res) {
    userModel.findOne({ email: req.session.user.email }, { firstName: 1, lastName: 1, profileImage: 1, role: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.addLead = function(req, res) {
    var saveLead = new leadModel(req.body);
    waterfall([
        function(callback) {
            saveLead.save(function(err, result1) {
                if (!err) {
                    callback(null, result1);
                }
            });
        },
        function(result1, callback) {

            var noteObj = {
                leadId: result1._id,
                actorId: req.session.user._id,
                actor: req.session.user.firstName + ' ' + req.session.user.lastName,
                action: 'a new lead',
                noteType: 'firstNote'
            };

            var saveNote = new noteModel(noteObj);
            saveNote.save(function(err, result2) {
                if (!err) {
                    callback(null, result1);
                }
            });
        }

    ], function(err, result2) {
        var noteObj = {
            leadId: result2._id,
            actorId: req.session.user._id,
            actor: req.session.user.firstName + ' ' + req.session.user.lastName,
            action: 'workflow' + ' ' + result2.status,
            noteType: 'firstNote'
        };

        var saveNote = new noteModel(noteObj);
        saveNote.save(function(err) {
            res.status(201).send();
        });
    });
};

exports.updateLead = function(req, res) {
    waterfall([
        function(callback) {
            leadModel.findOne({ _id: req.body._id }, function(err, result) {
                if (result.status == req.body.status) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
        },
        function(result1, callback) {
            if (result1 == true) {
                var noteObj = {
                    leadId: req.body._id,
                    actorId: req.session.user._id,
                    actor: req.session.user.firstName + ' ' + req.session.user.lastName,
                    action: req.body.status,
                    noteType: 'changedNote'
                };

                var saveNote = new noteModel(noteObj);
                saveNote.save(function(err) {
                    callback(null);
                });
            } else {
                callback(null);
            }
        }
    ], function(err, result2) {
        leadModel.update({ _id: req.body._id }, {
            $set: {
                assignName: req.body.assignName,
                assignId: req.body.assignId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                company: req.body.company,
                mobile: req.body.mobile,
                email: req.body.email,
                status: req.body.status,
                campaign: req.body.campaign,
                priority: req.body.priority,
                address: req.body.address,
                zip: req.body.zip,
                lastEdited: Date.now(),
                editor: req.session.user.firstName
            }
        }, function(err, result) {
            if (result.n == 1) {
                res.status(201).json();
            }
        });
    });
};

exports.getLeadDetails = function(req, res) {
    leadModel.find({}, { email: 1, firstName: 1, lastName: 1, company: 1, assignName: 1, assignId: 1, lastEdited: 1, editor: 1, status: 1, priority: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.leadProfile = function(req, res) {
    leadModel.findOne({ _id: req.query.id }, { created_at: 0 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.getNote = function(req, res) {
    noteModel.find({ leadId: req.query.id }, function(err, result) {
        res.status(200).json({ result: result });
    }).sort({ noteDate: -1 });
};

exports.newNote = function(req, res) {
    var noteObj = {
        leadId: req.body.leadId,
        actorId: req.session.user._id,
        actor: req.session.user.firstName + ' ' + req.session.user.lastName,
        noteType: 'newNote',
        message: req.body.addingNote
    };

    var saveNote = new noteModel(noteObj);
    saveNote.save(function(err) {
        if (!err) {
            res.status(201).send();
        }
    });
};