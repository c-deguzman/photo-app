

module.exports = function(app){
	var MongoClient = require('mongodb').MongoClient;

	app.post('/ac_request', function(request, response) {

		var MongoClient = require('mongodb').MongoClient;
      	var ObjectId = require('mongodb').ObjectId; 
      	var obj_id = new ObjectId(request.body.id);
        var book_id = request.body.id;

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }

    		db.collection("books", function(err, collection){
    			if (err){
    				throw (err);
    				return;
    			}

    			collection.findOne({_id: obj_id}, function(err, doc){
    				if (err){
    					throw err;
    					return;
    				}

    				if (!doc){
    					response.send({
    						"result": "error",
    						"error": "Book not found."
    					});
    					return;
    				} else if (doc.user != request.user){
    					response.send({
    						"result": "error",
    						"error": "This is not your book."
    					});
    				} else {
    					collection.remove({_id: obj_id}, function (err, num){
    						if (err){
    							throw err;
    							return;
    						}

                            db.collection("trade_reqs", function(err, collection){
                                if (err){
                                    throw (err);
                                    return;
                                }

                                collection.remove({book_id: book_id}, function (err, num){
                                    response.send({
                                        "result": "success",
                                        "error": ""
                                    });
                                });
                            });
    					});
    				}
    			})
    		});
    	});
	});	        			
}