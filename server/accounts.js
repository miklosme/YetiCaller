Meteor.users.deny({
  update: function () {
    return true;
  }
});

Meteor.methods({
  kickPlayer: function(_id) {
    var player = Meteor.users.findOne(_id);
    var rank = player.profile.rank;
    if ((rank === RANK_LEADER) || (rank === RANK_COLEADER)) {
      throw new Meteor.Error("not-allowed");
    }
    Meteor.users.remove(_id);
  },
  promotePlayer: function(_id) {
    var newRank = Meteor.users.findOne(_id).profile.rank || RANK_MEMBER;
    newRank = Math.min(newRank + 10, RANK_LEADER);

    if (newRank === RANK_LEADER) {
      if (Meteor.user().profile.rank !== RANK_LEADER) {
        throw new Meteor.Error("not-allowed");
      }

      Meteor.users.update(Meteor.user()._id, {
        $set: {
          "profile.rank": RANK_COLEADER
        }
      });
    }
    Meteor.users.update(_id, {
      $set: {
        "profile.rank": newRank
      }
    }, {
      upsert: false
    });
  },
  demotePlayer: function(_id) {
    var newRank = Meteor.users.findOne(_id).profile.rank || RANK_MEMBER;
    newRank = Math.max(newRank - 10, RANK_MEMBER);
    Meteor.users.update(_id, {
      $set: {
        "profile.rank": newRank
      }
    }, {
      upsert: false
    });
  },
  setOptin: function(_id, value) {
    Meteor.users.update({_id: _id}, {
      $set: {
        "profile.optin": value
      }
    }, {
      upsert: false
    });
  }
});
