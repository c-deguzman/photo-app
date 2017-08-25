module.exports = function(app){
	
	app.post('/like', function(request, response) {

		if (request.isAuthenticated() == false){
			response.send({
				result: "error",
				error: "You must be signed in to like photos"
			});
			
			return;
		}

		var MongoClient = require('mongodb').MongoClient;
		var ObjectId = require('mongodb').ObjectId; 
	    var obj_id = new ObjectId(request.body.id);

	    var raw_id = request.body.id;

		var time = Math.round(new Date().getTime()/1000);

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }


	    	db.collection("likes", function (err, collection){
	    		if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Please report this to site admin."});
		            return;
		          }

		        collection.findOne({photo_id: raw_id, from: request.user._id}, function (err, doc){
	            	if (err){
			            response.send({"result": "error",
			        			       "error": "Internal connection ERROR. Error retrieving site photo information."});
			        	return;
			        }

			        if (doc){
			        	response.send({
				        	"result": "error",
				        	"error": "User has already liked this photo."
				        });
			        } else {

			        	collection.insertOne({photo_id: raw_id, from: request.user._id}, function (err, doc){
			        		if (err){
					            response.send({"result": "error",
					        			       "error": "Internal connection ERROR. Error retrieving site photo information."});
					        	return;
					        }

					        db.collection("photos", function (err, collection){
					    		if (err){
						            response.send({"result": "error",
						        			       "error": "Internal connection ERROR. Please report this to site admin."});
						            return;
					          	}

					          	collection.updateOne({_id: obj_id}, {$inc : {likes: 1}}, function(err, doc){
					          		if (err){
							            response.send({"result": "error",
							        			       "error": "Internal connection ERROR. Error retrieving site photo information."});
							        	return;
							        }

							        response.send({
							        	result: "success", 
							        	error: ""
							        });
					          	});

					      	});
			        	});
			        }
		      	});
	    	});
  		});
	});
}