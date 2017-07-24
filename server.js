var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');

const passport = require('passport')  
const session = require('express-session')  
const RedisStore = require('connect-redis')(session)

var login = require('./routes/login.js');
var register = require("./routes/register.js");

var flash = require("connect-flash");
var cookieParser = require('cookie-parser')

var React = require('react');
var ReactDOM = require('react-dom/server');

require('babel-core/register');
require('babel-polyfill');

var app = express();
var compiler = webpack(config);

require('./authentication').init(app)

app.use(cookieParser());
app.use(flash());


app.use(session({  
  store: new RedisStore({
    url: process.env.REDIS
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(passport.initialize())  
app.use(passport.session()) 

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

login(app);
register(app);


app.use(function(request, response, next){
  
  if ((request.isAuthenticated() && request.path == "/login/") || 
      (request.isAuthenticated() && request.path == "/register/")) {
      response.redirect('/home/');
    }
  
  console.log(request.path);
  
  if (request.isAuthenticated() || request.path == "/login/" || request.path == "/register/") {
      return next()
    }
  
    response.redirect('/login/');
});



app.get('/', function(request, response) {
  
});

app.get('/logout', function (request, response){
  request.session.destroy(function (err) {
    response.redirect('/login/');
  });
});


app.get('/login', function(request, response) {
  //response.sendFile(path.join(__dirname, '/views/login_index.html'));
  var Login_App = require("./src/Login.js").default;
  var Login_html = require("./src/login_template").default;

  var props = {auth: request.isAuthenticated(), error: request.flash("error")};
  
  var Comp_Fact = React.createFactory(Login_App);
  const Login_string = ReactDOM.renderToString(Comp_Fact(props));
  
  response.send(Login_html({
    body: Login_string,
    title: "Voting App",
    props: safeStringify(props)
  }));
});

app.get('/register', function(request, response) {
  var Register_App = require("./src/Register.js").default;
  var Register_html = require("./src/register_template").default;

  var props = {auth: request.isAuthenticated(), error: request.flash("error")};
  
  var Comp_Fact = React.createFactory(Register_App);
  const Register_string = ReactDOM.renderToString(Comp_Fact(props));
  
  response.send(Register_html({
    body: Register_string,
    title: "Voter Registration"
  }));
});

app.get('/home', function(request, response) {
  response.send("Welcome " + request.user);
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});


function safeStringify(obj) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/ig, '<\\/$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028') 
    .replace(/\u2029/g, '\\u2029');
}