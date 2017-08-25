
module.exports = function(app){
	var register = require("./register.js");
	var get_info = require("./get_info.js");
	var add_pic = require("./add_pic.js");

	var like = require("./like.js");
	var unlike = require("./unlike.js");

	var login = require('./login.js');

	login(app);
	register(app);

	add_pic(app);

	like(app);
	unlike(app);

	get_info.get_user(app);
	get_info.get_pics(app);
	get_info.get_likes(app);
	

	var basic_routes = require('./basic_routes.js');

	basic_routes(app);

}