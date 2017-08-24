module.exports = {

  get_auth (app){
    app.post('/get_auth', function(request, response) {
      response.send(request.isAuthenticated());
    });
  },
  
  get_user(app){
    app.post('/get_user', function(request, response){
      if (!request.isAuthenticated()){
        response.send(false);
      } else {
        response.send(request.user.displayName);
      }
    });
  },

  get_books(app){
    app.post('/get_books', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("books", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.find({}, {"sort" : [['time', 'descending']]}).toArray(function (err, documents) {

            if (err){
              throw err;
              return;
            }
            response.send({books: documents});
          });   
        });
      });
    });
  },

  get_requests(app){
    app.post('/get_requests', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("trade_reqs", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          var query = {};

          if (request.body.mode == "to"){
            query = {to: request.user};
          } else {
            query = {from: request.user}
          }

          collection.find(query).toArray(function (err, documents) {

            if (err){
              throw err;
              return;
            }

            response.send(documents);
          });   
        });
      });
    });
  },

  get_book_reqs(app){
    app.post('/get_book_reqs', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("trade_reqs", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.find({book_id: request.body.id}).toArray(function (err, documents) {

            if (err){
              throw err;
              return;
            }

            if (documents.length > 0 && documents[0].to != request.user){
              response.send([]);
            } else {
              response.send(documents);
            }

          });   
        });
      });
    });
  },

  reject(app){
    app.post('/reject', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;
      var ObjectId = require('mongodb').ObjectId; 

      var obj_id = new ObjectId(request.body.id);

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("trade_reqs", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.findOne({_id: obj_id}, function (err, doc) {

            if (err){
              throw err;
              return;
            }

            if (!doc){
              response.send({
                "result": "error",
                "error": "Book request not found."
              });
            } else if (doc.to != request.user){
              response.send({
                "result": "error",
                "error": "You do not own this book."
              });
              return;
            } else {
              collection.remove({_id: obj_id}, function (err, num){
                if (err){
                  throw err;
                  return;
                }

                response.send({
                  "result": "success",
                  "error": ""
                });
              });
            }
          });   
        });
      });
    });
  },

   valid_id(app){
    app.post('/valid_id', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;
      var ObjectId = require('mongodb').ObjectId; 

      var obj_id = new ObjectId(request.body.id);

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("books", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.findOne({_id: obj_id}, function (err, doc) {

            if (err){
              throw err;
              return;
            }

            if (doc){
              response.send(true);
              return;
            } else {
              response.send(false);
            }
          });   
        });
      });
    });
  },

  get_book(app){
    app.post('/get_book', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;
      var ObjectId = require('mongodb').ObjectId; 

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("books", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.findOne({_id: (new ObjectId(request.body.id))}, function (err, doc) {

            if (err){
              throw err;
              return;
            }

            response.send(doc);
          });   
        });
      });
    });
  },

  get_user_info(app){
    app.post("/get_user_info", function(request, response){
      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("accounts", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.findOne({user: request.user}, function(err, doc){
            if (err){
              throw err;
              return;
            }

            response.send({
              name: doc.name,
              city: doc.city,
              prov: doc.prov
            });
          });  
        });
      });
    });
  },

  update_info(app){
    app.post("/update_info", function(request, response){
      var MongoClient = require('mongodb').MongoClient;

      var name = request.body.name;
      var prov = request.body.prov;
      var city = request.body.city;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("accounts", function (err, collection){

          if (err){
            response.send({
              result: "error",
              error: "Database connection failed."
            });
            return;
          }

          collection.update({user: request.user}, {$set: {name: name, prov: prov, city: city}}, function(err, doc){
            if (err){
              response.send({
                result: "error",
                error: "User information update failed."
              });
              return;
            }

            response.send({
              result: "success"
            });
          });  
        });
      });
    });
  },

  set_disp(app){
    app.post("/set_disp", function(request, response){
      var MongoClient = require('mongodb').MongoClient;

      var displayName = request.body.displayName;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("accounts", function (err, collection){

          if (err){
            response.send({
              result: "error",
              error: "Database connection failed."
            });
            return;
          }

          collection.updateOne({user: request.user.user, twitterID: request.user.twitterID, pass: request.user.pass}, {$set: {displayName: displayName, firstTime: false}}, function(err, result){
            if (err){
              response.send({
                result: "error",
                error: "User information update failed."
              });
              return;
            }

            collection.findOne({user: request.user.user, twitterID: request.user.twitterID, pass: request.user.pass}, function(err, doc){
              if (err){
                response.send({
                  result: "error",
                  error: "User information update failed."
                });
                return;
              }

              request.login(doc, function(err) {
                if (err){
                  response.send({
                    result: "error",
                    error: "Relogging failed."
                  });
                  return;
                }

                response.send({
                  result: "success",
                  error: ""
                });
              });
            });
          });  
        });
      });
    });
  }
}