var mongo_url = process.env.MONGODB_URI ||
                'mongodb://localhost/mymdb_db';

// require mongoose, and connect it with the given url
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url)

// requiring the Movie module
var Movie = require('./models/movie');
var Actor = require('./models/actor');
var User = require('./models/user');

// require all installed modules
var bodyParser = require('body-parser');

// require express module
var express = require('express');

// run express
var app = express();

// set up the port
var port = process.env.PORT || 5000;
app.set('port', port);

// set all the middlewares

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// let's set the routes to list all the movie


// create user with email and password
app.post('/signup', function(req, res) {
  var userObject = new User(req.body.user);

  userObject.save(function(err, user) {
    if(err){
      return res.status(401).send(err);
    } else {
      return res.status(200).send({message: "user created"});
    }
  });
});

// basic check if login post was done
app.post('/login', function(req, res) {
  User.findOne({ email: req.body.user.email, password: req.body.user.password }, function(err, user) {
    if(err) res.send(err);

    if(user) {
      res.send(user);
    } else {
      res.status(401).send({ message: 'login failed' });
    }
  });
});

// list all movies

app.route('/movies')
  .get(function(req, res) {
    Movie.find({}).exec(function(err, movies) {
      if (err) res.status(400).send(err);
      res.json(movies);
    });
  })
  .post(function(req, res, next) {
    var new_movie = new Movie(req.body);

    new_movie.save(function(err) {
      if (err) res.status(400).send(err);

      res.json(new_movie);
    });
  });

app.route('/actors')
  .get(function(req, res) {
    Actor.find({}).exec(function(err, actors) {
      if (err) res.status(400).send(err);
      res.json(actors);
    });
  })
  .post(function(req, res, next) {
    var new_actor = new Actor(req.body);

    new_actor.save(function(err) {
      if (err) res.status(400).send(err);

      res.json(new_actor);
    });
  });

app.route('/actors/:actor_id')
    .get( function(req, res, next) {
      res.json(req.actor);
      // refactoring the queries by param

      // var actor_id = req.params.actor_id;
      // Actor.findOne({
      //   _id: actor_id
      // }, function(err, actor) {
      //   if(err) res.status(400).send(err);
      //
      //   res.json(actor);
      // }
      // );
    })
    .put( function(req, res, next) {
      // console.log(req.body);
      var actor_id = req.actor.id;

      Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
        if(err) res.status(400).send(err);
        Actor.findOne({ _id: actor_id}, function(err, actor) {
          res.json(actor);
        });
      });
    })
    .delete( function(req, res, next) {
      if(err) res.status(400).send(err);

      res.json(req.actor);
    })

app.param('actor_id', function(req, res, next, actor_id) {
  Actor.findOne({
    _id: actor_id
  }, function(err, actor) {
    if(err) res.status(400).send(err);

    req.actor = actor;
    next();
  });
});

// listening to the port
app.listen(app.get('port'), function() {
  console.log('running on port: ' + app.get('port'));
});

// exporting app for testing purposes
module.exports = app;
