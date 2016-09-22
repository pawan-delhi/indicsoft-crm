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

exports.getLeadDetails = function(req, res) {
    leadModel.find({}, { email: 1, firstName: 1, lastName: 1, company: 1, assignName: 1, assignId: 1, lastUpdated: 1, status: 1, priority: 1 }, function(err, result) {
        res.status(200).json({ result: result });
    });
};

exports.leadProfile = function(req, res) {
    leadModel.findOne({ _id: req.query.id }, function(err, result) {
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