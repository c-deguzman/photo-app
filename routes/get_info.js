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
      }
      
      response.send(request.user);
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

  get_poster_info(app){
    app.post("/get_poster_info", function(request, response){
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

          collection.findOne({user: request.body.user}, function(err, doc){
            if (err){
              throw err;
              return;
            }

            var location;

            if (doc.city != "" && doc.prov != ""){
              location = "(" + doc.city + ", " + doc.prov + ")";
            } else if (doc.city != ""){
              location = "(" + doc.city + ")";
            } else if (doc.prov != ""){
              location = "(" + doc.prov + ")";
            } else {
              location = "";
            }

            response.send(location);
            
          });  
        });
      });
    });
  },

  get_sim_users(app){
    app.post("/get_sim_users", function(request, response){
      var MongoClient = require('mongodb').MongoClient;

      var mode = request.body.mode;


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

            var goal_city = doc.city;
            var goal_prov = doc.prov;

            var q;

            if (mode == "city"){
              q = {city: goal_city};
            } else {
              q = {prov: goal_prov};
            }

            collection.find(q).toArray(function(err, docs){
              if (err){
                throw err;
                return;
              }
              
              var return_arr = [];

              for (var i in docs){
                return_arr.push(docs[i].user);
              }

              response.send(return_arr);
            });
          });  
        });
      });
    });
  },
}