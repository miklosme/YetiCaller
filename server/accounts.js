Meteor.users.deny({
  update: function () {
    return true;
  }
});

Meteor.methods({
  kickPlayer: function(_id) {
    Meteor.users.remove({_id: _id});
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