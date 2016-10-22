require('./models/userModel.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');

module.exports = function(io) {
    io.on("connection", function(socket) {
        socket.on("user-entered", function() {
            var loggedIn = true;
            if (loggedIn === true) {
                userModel.update({ email: socket.request.session.user.email }, {
                    $set: {
                        loggedIn: true
                    },
                }, function(err, result) {
                    userModel.findOne({ email: socket.request.session.user.email }, { _id: 0, isActive: 0, password: 0, __v: 0, activationToken: 0 }, { password: 0, activationToken: 0 }, function(err, result) {
                        io.emit("login-status", { result: result });
                    });
                    userModel.find({}, { firstName: 1, lastName: 1, email: 1, created_at: 1, created_by: 1, role: 1, blocked: 1, loggedIn: 1 })
                        .paginate(1, 9, function(err, docs, total) {
                            io.emit("updated-list", { total: total, result: docs });
                        });
                });
            }
        });

        socket.on('disconnect', function() {
            loggedIn = false;
            userModel.update({ email: socket.request.session.user.email }, {
                $set: {
                    lastLogin: Date.now(),
                    loggedIn: false
                },
            }, function(err, result) {
                userModel.findOne({ email: socket.request.session.user.email }, { _id: 0, isActive: 0, password: 0, __v: 0, activationToken: 0 }, { password: 0, activationToken: 0 }, function(err, result) {
                    io.emit("login-status", { result: result });
                });
                userModel.find({}, { firstName: 1, lastName: 1, email: 1, created_at: 1, created_by: 1, role: 1, blocked: 1, loggedIn: 1 })
                    .paginate(1, 9, function(err, docs, total) {
                        io.emit("updated-list", { total: total, result: docs });
                    });
            });
        });
    });
};