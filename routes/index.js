
module.exports = function(app){
	var register = require("./register.js");
	var get_info = require("./get_info.js");
	var add_pic = require("./add_pic.js");
	var add_req = require("./add_request.js");
	var rm_req = require("./rm_request.js");
	var ac_req = require("./ac_request.js");

	var login = require('./login.js');

	login(app);
	register(app);
	add_pic(app);

	add_req(app);
	rm_req(app);
	ac_req(app);
	

	get_info.get_user(app);
	get_info.get_pics(app);


	get_info.get_book(app);

	get_info.set_disp(app);

	/*

	get_info.get_user_info(app);
	get_info.update_info(app);
	get_info.get_sim_users(app);
	get_info.get_poster_info(app);

	get_info.get_requests(app);
	get_info.get_book_reqs(app);


	get_info.reject(app);
	get_info.valid_id(app);

	*/

	var basic_routes = require('./basic_routes.js');

	basic_routes(app);

}