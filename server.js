/*
 Referenced from :
 https://github.com/braitsch/node-login
 https://github.com/braitsch/node-login
 https://github.com/scotch-io/easy-node-authentication
 https://scotch.io/tutorials/easy-node-authentication-setup-and-local
 http://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript
 https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication
 http://jsfiddle.net/asimshahiddIT/jrjjzw18/

 */
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url, {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
}).connection;// connect to our database
require('./config/passport')(passport);

app.configure(function () {

    app.use(express.logger('dev'), null);
    app.use(express.cookieParser(), null);
    app.use(express.bodyParser(), null);
    app.use(express.static(__dirname + '/assets'), null);
    app.set('view engine', 'ejs');

    app.use(express.session({secret: 'Recommendation-System'}), null);
    app.use(passport.initialize(), null);
    app.use(passport.session(), null);
    app.use(flash(), null);

});

require('./app/routes.js')(app, passport);
app.listen(port);
