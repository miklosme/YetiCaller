Meteor.methods({
  registerAttack: function(_id, index) {
    Wars.update({
      _id: _id, 
      'targets.index': index
    }, {
      $push: { 
        'targets.$.attacks': {
          name: Meteor.user().profile.name,
          stars: -1
        }
      }
    });
  }
});