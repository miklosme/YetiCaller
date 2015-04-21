Meteor.methods({
  registerAttack: function(warID, index) {
    var user = Meteor.user();
    Wars.update({
      _id: warID,
      'targets.index': index
    }, {
      $push: {
        'targets.$.attacks': {
          name: user.profile.name,
          id: user._id,
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
  cancelAttack: removeReservation, // TODO: ide nem remove kell, hanem törlés az attacks-ból
  setResult: function(warID, index, playerID, result) {
    removeReservation(warID, index);
    handleAttacks(warID, index, playerID, result);
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
      'participants._id': playerID
    }, {
      $inc: {
        'participants.$.attacksLeft': -1
      }
    });
  }
});

function removeReservation(warID, index) {
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

function handleAttacks(warID, index, playerID, result) {
  /*var $set = {};
  $set['targets.'+(index-1)+'.attacks.$.stars'] = result;
  $set['targets.'+(index-1)+'.attacks.$.isAttackDone'] = true;
  Wars.update({
    _id: warID,
    'targets.index': index,
    'targets.attacks.id': playerID
  }, {
    $set: $set
  });*/

  /*Wars.update({
    _id: warID,
    'targets.index': index,
    'targets.attacks.id': playerID
  }, {
    $set: {
      'targets.$.attacks.$.stars': result,
      'targets.$.attacks.$.isAttackDone': true,
    }
  });*/
}

Meteor.methods({
  'registerTargetChatMessage': function(message, warID, targetIndex) {

    Chat.insert({
      name: Meteor.user().profile.name,
      message: message,
      warID: warID,
      targetIndex: targetIndex,
      createdAt: new Date()
    });
  }
});
