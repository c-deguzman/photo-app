
module.exports = function(app){
	var register = require("./register.js");
	var get_info = require("./get_info.js");
	//var make_poll = require("./make_poll.js");
	var add_book = require("./add_book.js")

	var login = require('./login.js');

	login(app);
	register(app);
	add_book(app);
	
	get_info.get_auth(app);
	get_info.get_user(app);
	get_info.get_books(app);

	/*
	//get_info.get_polls(app);
	//get_info.get_poll(app);
	//get_info.vote(app);
	//get_info.add_option(app);
	//get_info.get_my_polls(app);
	//get_info.delete_poll(app);
	//make_poll(app);
	*/

	var basic_routes = require('./basic_routes.js');

	basic_routes(app);

}