function formatTime(unix){
	var d = new Date(unix * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	var datestring = months[d.getMonth()] + " " + d.getDate()  + " " + d.getFullYear() + "@" + d.getHours() + ":" + (d.getMinutes() <= 9 ? "0" : "") + d.getMinutes();

	return datestring;
}

module.exports = function(app){
	var MongoClient = require('mongodb').MongoClient;

	app.post('/add_request', function(request, response) {

		var time = Math.round(new Date().getTime()/1000);
		var book_id = request.body.id;
		var from = request.user;
		var msg = request.body.message


		var MongoClient = require('mongodb').MongoClient;
      	var ObjectId = require('mongodb').ObjectId; 
      	var obj_id = new ObjectId(request.body.id);

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }
	    	db.collection("books", function (err, collection){
	    		if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Please report this to site admin."});
		            return;
		          }

		        collection.findOne({_id: obj_id}, function (err, doc){
	            	if (err){
			            response.send({"result": "error",
			        			       "error": "Internal connection ERROR. Please report this to site admin."});
			            return;
			          }

			        if (!doc){
			        	response.send({"result": "error",
			        					"error": "Could not find book. Book may have just been delisted."
			        	});
			        	return;
			        } else {
			        	if (doc.user == request.user){
			        		response.send({
			        			"result": "error",
			        			"error": "Cannot request your own book."
			        		});
			        		return;
			        	} else {

			        		var to = doc.user;

			        		db.collection("trade_reqs", function(err, coll){
			        			if (err){
			        				throw (err);
			        				return;
			        			}

			        			coll.findOne({from: from, to: to, book_id: book_id}, function(err, doc){
			        				if (err){
			        					throw err;
			        				}

			        				if (doc){
			        					response.send({
			        						"result": "error",
			        						"error": "You have already requested this book! Requested " + formatTime(doc.time)
			        					});
			        					return;
			        				} else {
			        					coll.insertOne({from: from, to: to, book_id: book_id, time: time, message: msg}, function (err, doc){
			        						if (err){
			        							throw err;
			        							return;
			        						}

			        						response.send({
			        							"result": "success",
			        							"error": ""
			        						})
			        					});
			        				}
			        			})
			        		});
			        	}
			        }
		      	});
	    	});
  		});
	});
}