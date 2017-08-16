module.exports = function(app){
	var MongoClient = require('mongodb').MongoClient;

	app.post('/add_book', function(request, response) {

		var time = Math.round(new Date().getTime()/1000);

		var add_doc = 	{
			cover: request.body.cover,
			title: request.body.title,
			user: request.user,
			isbn: request.body.isbn,
			time: time
		};	 

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }


	    	db.collection("books", function (err, coll){
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