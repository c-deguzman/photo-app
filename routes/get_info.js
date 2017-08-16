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
  }
}