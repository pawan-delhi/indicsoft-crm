var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var app = express();
var server = http.createServer(app);

var router = express.Router();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost/IndicsoftCRM'
    })
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes.js')(app, router);
require('./database/dbconfig.js');
require('./database/autoData.js');

server.listen(process.env.PORT || 3000, function() {});