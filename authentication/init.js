const passport = require('passport')  
const LocalStrategy = require('passport-local').Strategy
const TwitterStrategy = require('passport-twitter').Strategy

var MongoClient = require('mongodb').MongoClient;


function findLocalUser(username, callback){

  MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
    if (err){
      throw err;
      return callback(err);
    }

    db.collection("accounts", function (err, collection){

      if (err){
        throw err;
        return callback(err);
      }

      collection.findOne({"user": username}, function (err, result){

        db.close();

        if (err) {
          return callback(err);
        }
        
        return callback(null, result);
      
      });
    });
  });
}

function findTwitterUser(twitterID, callback){
  MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
    if (err){
      throw err;
      return callback(err);
    }

    db.collection("accounts", function (err, collection){

      if (err){
        throw err;
        return callback(err);
      }

      collection.findOne({"twitterID": twitterID}, function (err, result){

        if (err) {
          return callback(err);
        } else if (result){
          return callback(null, result);
        } else {

          var doc = {user: "",
                    pass: "",
                    twitterID: twitterID,
                    displayName: "",
                    firstTime: true
                  };

          collection.insertOne(doc, function (err,result){
            if (err){
              return callback(err);
            }
            
            db.close();

            return callback(null, result.ops[0]);
          });
        }
      });
    });
  });
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


function initPassport () {
  passport.use(new LocalStrategy(
    {usernameField:"user", passwordField:"pass"},
    function(username, password, done) {
      findLocalUser(username, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'Invalid username' })
        }
        if (password !== user.pass ) {
          return done(null, false, { message: 'Incorrect password' })
        }
        return done(null, user);
      });
    }
  ));

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.BASE_URL + "/auth/twitter/callback"
  }, function(token, tokenSecret, profile, done) {

    findTwitterUser(profile.id , function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Twitter ID not found' })
      }

      return done(null, user);
    });
  }
));
}

module.exports = initPassport