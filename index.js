var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);

var router = express.Router();

var sessionMiddleware = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost/IndicsoftCRM'
    })
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


require('./routes.js')(app, router);
require('./socketController.js')(io);
require('./database/dbconfig.js');
require('./database/autoData.js');

server.listen(process.env.PORT || 3000, function() {
    console.log('server is listening on port ', server.address().port);
});