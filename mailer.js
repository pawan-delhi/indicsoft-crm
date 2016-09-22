var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'ourncr00@gmail.com',
        pass: 'itsmylife-189'
    }
}));

exports.transporter = transporter;