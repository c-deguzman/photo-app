module.exports = function(app){
	
	app.post('/delete', function(request, response) {

		if (request.isAuthenticated() == false){
			response.send({
				result: "error",
				error: "You must be signed in to delete photos"
			});
			
			return;
		}

		var MongoClient = require('mongodb').MongoClient;
		var ObjectId = require('mongodb').ObjectId; 
	    var obj_id = new ObjectId(request.body.id);

	    var raw_id = request.body.id;

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }


	    	db.collection("photos", function (err, collection){
	    		if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Please report this to site admin."});
		            return;
		          }

		        collection.findOne({_id: obj_id}, function (err, doc){
	            	if (err){
			            response.send({"result": "error",
			        			       "error": "Internal connection ERROR. Error retrieving site photo information."});
			        	return;
			        }

			        if (!doc){
			        	response.send({
				        	"result": "error",
				        	"error": "Photo does not exist."
				        });
				        return;
			        } else if (request.user._id != doc.user_id){
			        	response.send({
				        	"result": "error",
				        	"error": "This is not your photo."
				        });
				        return;
			        } else {

			        	collection.removeOne({_id: obj_id}, function (err, doc){
			        		if (err){
					            response.send({"result": "error",
					        			       "error": "Internal connection ERROR. Error retrieving site photo information."});
					        	return;
					        }

					        db.collection("likes", function (err, collection){
					    		if (err){
						            response.send({"result": "error",
						        			       "error": "Internal connection ERROR. Please report this to site admin."});
						            return;
					          	}

					          	collection.remove({photo_id: raw_id}, function(err, doc){
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