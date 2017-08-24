require('dotenv').config()

require('babel-core/register');


process.env.ROOT = __dirname;


var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');

const passport = require('passport')  
const session = require('express-session')  
const RedisStore = require('connect-redis')(session)

var cookieParser = require('cookie-parser')

var cors = require("cors");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var app = express();
var compiler = webpack(config);

require('./authentication').init(app);


// ------------------------------------------------------------ MIDDLEWARE ---------------------------------------------------------------------


app.use(cookieParser());

//app.use(cors({origin: "https://photo-app-zeta.herokuapp.com/"}));

app.use(session({  
  store: new RedisStore({
    url: process.env.REDIS
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));

app.use(passport.initialize())  
app.use(passport.session()) 

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.enable('trust proxy');

/*

app.use(function(request, response, next){

  var unauth_paths = ["/login", "/login/", "/register", "/register/", "/"];

  if ((!request.isAuthenticated() && unauth_paths.indexOf(request.path) != -1) ||
        request.isAuthenticated() && unauth_paths.indexOf(request.path) == -1){
    return next();
  } else if  (!request.isAuthenticated() && unauth_paths.indexOf(request.path) == -1){
    response.redirect("/");
  } else if (request.isAuthenticated() && unauth_paths.indexOf(request.path) != -1){
    response.redirect("/home");
  }
  
});

*/

app.use(function(request, response, next){
  console.log(request.user);
  return next();
});



// ------------------------------------------------------------ ROUTES ---------------------------------------------------------------------------

var routes = require('./routes');
routes(app);


// ------------------------------------------------------------ SERVER LISTEN ---------------------------------------------------------------------------


//app.listen(3000, '0.0.0.0', function(err) {
app.listen(process.env.PORT || 3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at ' + process.env.BASE_URL);
});

// ------------------------------------------------------------ MISC FUNCTIONS ---------------------------------------------------------------------------


function safeStringify(obj) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/ig, '<\\/$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028') 
    .replace(/\u2029/g, '\\u2029');
}
