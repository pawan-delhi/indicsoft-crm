var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var dburi = "mongodb://localhost/IndicsoftCRM";

mongoose.connect(dburi);

mongoose.connection.on('connected', function() {});

mongoose.connection.on('error', function() {
    console.log('Sorry! Database connection failed');
});