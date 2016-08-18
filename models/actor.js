var mongoose = require('mongoose');

// setting up how json structure would be like
var actorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email not found'],
    match: [/.+\@.+\..+/, 'Email is invalid']
  },
  age: {
    type: Number,
    index: true
  },
  website: {
    type: String,
    trim: true,
    get: function(url) {
      if(! url) {
        return url;
      } else {
        if(
          url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0
        ) {
          url = 'http://' + url;
        }

        return url;
      }
    }
  },
  // created_at: {
  //   type: Date,
  //   default: Date.now
  // }
});

// example of a query helper
actorSchema.query = {
  byName: function(name) {
    return this.find({ $or: [
                              { firstName: new RegExp(name, 'i') },
                              { lastName: new RegExp(name, 'i') },
                            ]
                    });
  }
}

// set a virtual attributes
actorSchema.virtual('fullName')
.get(function() {
     return this.firstName + ' ' + this.lastName;
}) // getting the virtual attributes on json view
.set(function(fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
}); // allowing virtual attributes to interact with actual mongo attr


// register the modifiers
actorSchema.set('toJSON', { getters: true, virtuals: true } );
actorSchema.set('timestamps', {}); // default timestamps by default

// register the Schema
var Actor = mongoose.model('Actor', actorSchema);

// make this available to our other files
module.exports = Actor;
