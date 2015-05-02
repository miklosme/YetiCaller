Meteor.methods({
  registerAttack: function(warID, index, user) {
    user || (user = Meteor.user());
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
        'targets.$.bookedForName': user.profile.name,
        'targets.$.bookedForID': user._id
      }
    });
  },
  cancelAttack: removeReservation, // TODO: ide nem remove kell, hanem törlés az attacks-ból
  autoReserve: function(warID, shiftValue) {
    var war   = Wars.findOne(warID);
    var start = Math.max(1, 1 + shiftValue);
    var end   = Math.min(war.size, war.size + shiftValue);
    var corrigation = shiftValue >= 0 ? 0 : Math.abs(shiftValue);
    _.each(_.range(start, end + 1), function(index, position) {
      var userID = _.findWhere(war.participants, {position: position + corrigation});
      var user = Meteor.users.findOne(userID._id);
      Meteor.call('registerAttack', warID, index, user);
    });
  },
  setResult: function(warID, index, playerID, result) {
    removeReservation(warID, index);
    handleAttacks(warID, index, playerID, result);
    // TODO: set "attacks" array data
    var war = Wars.findOne(warID);
    var target = _.findWhere(war.targets, {index: index});
    var user = Meteor.users.findOne(playerID);
    if (target.starCount < result) {
      Wars.update({
        _id: warID,
        'targets.index': index
      }, {
        $set: {
          'targets.$.starCount': result,
          'targets.$.bestAttackerName': user.profile.name
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
  },
  getWelcomePageStats: function() {
    var clanCount = Clans.find().count();
    var playerCount = Meteor.users.find().count();
    var warCount = Wars.find().count();
    var chatMessageCount = Chat.find().count();
    return {
      clanCount: clanCount,
      playerCount: playerCount,
      warCount: warCount,
      chatMessageCount: chatMessageCount
    };
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
  var $set = {};
  $set['targets.' + (index - 1) + '.attacks.$.stars'] = result;
  $set['targets.' + (index - 1) + '.attacks.$.isAttackDone'] = true;
  $set['targets.' + (index - 1) + '.attacks.$.attackedAt'] = new Date();
  var $query = {};
  $query['_id'] = warID;
  $query['targets.' + (index - 1) + '.index'] = index;
  $query['targets.' + (index - 1) + '.attacks.id'] = playerID;
  Wars.update($query, {
    $set: $set
  });

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
