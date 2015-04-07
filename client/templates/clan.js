Template.clan.helpers({
  members: function() {
    return Meteor.users.find({"profile.clanID": this._id}, {sort: {"profile.name": 1}});
  },
  pending: function() {
    return RegistrationTokens.find({clanID: this._id});
  },
  optin: function() {
    return Meteor.users.findOne({_id: this._id}).profile.optin;
  }
});

Template.clan.events({
  'submit': function(event, template) {
    event.preventDefault();
    
    var $input = template.$('[name=playername]');
    var name = $input.val();
    
    if (!name) {
      return;
    }
    
    RegistrationTokens.insert({
      name: name,
      token: makeToken(5),
      clanID: this._id
    }, function(err) {
      if (err)
        return;
        
      $input.val('');
    });
  },
  'click .cancel': function() {
    RegistrationTokens.remove({_id: this._id});
  },
  'click .kick': function() {
    Meteor.call("kickPlayer", this._id);
  },
  'change input.optin': function (event) {
     Meteor.call("setOptin", this._id, event.target.checked);
  }
});

function makeToken(size) {
    var text = "";
    //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}