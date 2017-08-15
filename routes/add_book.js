module.exports = function(app){
	var MongoClient = require('mongodb').MongoClient;

	app.post('/add_book', function(request, response) {

		var add_doc_user = {
			cover: request.body.cover,
		   	title: request.body.title,
		   	isbn: request.body.isbn
		};

		var add_doc_site = 	{
			cover: request.body.cover,
			title: request.body.title,
			user: request.user,
			isbn: request.body.isbn
		};	 

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }

          db.collection("accounts", function (err, collection){

            if (err){
	            response.send({"result": "error",
	        			       "error": "Internal connection ERROR. Please report this to site admin."});
	            return;
	          }

            collection.findOne({user: request.user}, function (err, doc){
            	if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Error retrieving user information."});
		        	return;
		        }

		        collection.findOneAndUpdate({user: request.user}, {$set : {books: doc.books.concat([add_doc_user])}}, function(err, doc){

		        	if (err){
		            	response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Error updating user information."});
		        		return;
		        	}

		        	db.collection("books", function (err, coll){
		        		if (err){
				            response.send({"result": "error",
				        			       "error": "Internal connection ERROR. Please report this to site admin."});
				            return;
				          }

				        coll.insertOne(add_doc_site, function (err, document){
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
        });
      });
	});
}