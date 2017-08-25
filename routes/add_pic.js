module.exports = function(app){
	var MongoClient = require('mongodb').MongoClient;

	app.post('/add_pic', function(request, response) {

		var time = Math.round(new Date().getTime()/1000);

		var add_doc = 	{
			url: request.body.url,
			desc: request.body.desc,
			name: request.user.displayName,
			user_id: request.user._id,
			height: request.body.height,
			time: time,
			likes: 0
		};	 

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }


	    	db.collection("photos", function (err, coll){
	    		if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Please report this to site admin."});
		            return;
		          }

		        coll.insertOne(add_doc, function (err, document){
	            	if (err){
			            response.send({"result": "error",
			        			       "error": "Internal connection ERROR. Error retrieving site book information."});
			        	return;
			        }

			        response.send({
			        	"result": "success",
			        	"error": ""
			        });
		      	});
	    	});
  		});
	});
}