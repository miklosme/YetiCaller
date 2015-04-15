Meteor.methods({
  registerAttack: function(warID, index) {
    Wars.update({
      _id: warID,
      'targets.index': index
    }, {
      $push: {
        'targets.$.attacks': {
          name: Meteor.user().profile.name,
          stars: 0,
          isAttackDone: false
        }
      },
      $set: {
        'targets.$.bookedForName': Meteor.user().profile.name,
        'targets.$.bookedForID': Meteor.user()._id
      }
    });
  },
  deleteAttack: _deleteAttack,
  setResult: function(warID, index, result) {
    _deleteAttack(warID, index);
    // TODO: set "attacks" array data
    var war = Wars.findOne(warID);
    var target = _.findWhere(war.targets, {index: index});
    if (target.starCount < result) {
      Wars.update({
        _id: warID,
        'targets.index': index
      }, {
        $set: {
          'targets.$.starCount': result,
          'targets.$.bestAttackerName': Meteor.user().profile.name
        }
      });
    }
    Wars.update({
      _id: warID,
      'participants._id': Meteor.user()._id
    }, {
      $inc: {
        'participants.$.attacksLeft': -1
      }
    });    
  }
});

function _deleteAttack(warID, index) {
  Wars.update({
    _id: warID,
    'targets.index': index
  }, {
    $unset: {
      'targets.$.bookedForName': "",
      'targets.$.bookedForID': ""
    }
  });
}
