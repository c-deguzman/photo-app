module.exports = function(app){

		require('babel-core/register');
	
		var React = require('react');
		var ReactDOM = require('react-dom/server');

		app.get('/', function (request, response){
		    response.redirect('/home/');
		});


		app.get('/logout', function (request, response){
		  request.session.destroy(function (err) {
		    response.redirect('/login/');
		  });
		});


		app.get('/login', function(request, response) {
		  //response.sendFile(path.join(__dirname, '/views/login_index.html'));
		  var Login_App = require(process.env.ROOT + "/src/Login.js").default;
		  var Login_html = require(process.env.ROOT + "/src/login_template").default;
		  
		  var Comp_Fact = React.createFactory(Login_App);
		  const Login_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(Login_html({
		    body: Login_string,
		    title: "Voting App"
		  }));
		});

		app.get('/register', function(request, response) {
		  var Register_App = require(process.env.ROOT + "/src/Register.js").default;
		  var Register_html = require(process.env.ROOT + "/src/register_template").default;
		  
		  var Comp_Fact = React.createFactory(Register_App);
		  const Register_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(Register_html({
		    body: Register_string,
		    title: "Voter Registration"
		  }));
		});

		app.get('/home', function(request, response) {
		  var Home_App = require(process.env.ROOT + "/src/Home.js").default;
		  var Home_html = require(process.env.ROOT + "/src/home_template").default;

		  var Comp_Fact = React.createFactory(Home_App);
		  const Home_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(Home_html({
		    body: Home_string,
		    title: "Home Page"
		  }));
		});

		app.get('/my_polls', function(request, response) {
		  var MyPolls_App = require(process.env.ROOT + "/src/MyPolls.js").default;
		  var MyPolls_html = require(process.env.ROOT + "/src/myPolls_template").default;

		  var Comp_Fact = React.createFactory(MyPolls_App);
		  const MyPolls_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(MyPolls_html({
		    body: MyPolls_string,
		    title: "My Polls"
		  }));
		});


		app.get('/create_poll', function(request, response) {
		  var CreatePoll_App = require(process.env.ROOT + "/src/CreatePoll.js").default;
		  var CreatePoll_html = require(process.env.ROOT + "/src/createPoll_template").default;

		  var Comp_Fact = React.createFactory(CreatePoll_App);
		  const CreatePoll_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(CreatePoll_html({
		    body: CreatePoll_string,
		    title: "Create Poll"
		  }));
		});

		app.get('/poll', function(request, response) {

		  var ChartDisplay_App = require(process.env.ROOT + "/src/ChartDisplay.js").default;
		  var ChartDisplay_html = require(process.env.ROOT + "/src/chartDisplay_template").default;

		  var Comp_Fact = React.createFactory(ChartDisplay_App);
		  const ChartDisplay_string = ReactDOM.renderToString(Comp_Fact());
		  
		  response.send(ChartDisplay_html({
		    body: ChartDisplay_string,
		    title: "Poll Results"
		  }));
		});
}