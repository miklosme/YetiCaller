var ERRORS_KEY = 'warDeclareErrors';

Template.warDeclare.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.warDeclare.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  members: function() {
    var clanID = Meteor.user().profile.clanID;
    return Meteor.users.find({"profile.clanID": clanID}, {sort: {"profile.name": 1}});
  },
  optinCount: function() {
    var clanID = Meteor.user().profile.clanID;
    var count = Meteor.users.find({
      "profile.clanID": clanID,
      "profile.optin": true
    }, {sort: {"profile.name": 1}}).count();
    Session.set("optinCount", count);
    return count;
  },
  optin: function() {
    return Meteor.users.findOne({_id: this._id}).profile.optin;
  }
});

Template.warDeclare.events({
  'submit': function(event, template) {
    event.preventDefault();
    var enemy = template.$('[name=enemy]').val();
    var size = Session.get("optinCount");
    var errors = {};
    
    if (! Meteor.user()) {
      errors.login = 'You must be logged in';
    }

    if (! enemy) {
      errors.enemy = 'Enemy name required';
    }
    
    if (! _.contains([10, 15, 20, 25, 30, 35, 40, 45, 50], size)) {
      errors.optinCount = 'Player optins must be [10, 15, ... 45, 50]';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    var targets = [];
    
    for (var i = 0; i < size; i++) {
      targets.push({
        index: i + 1,
        name: '',
        attacks: []
      });
    }
    
    Wars.insert({
      name: "vs. " + enemy,
      friendlyID: Meteor.user().profile.clanID,
      friendlyName: Meteor.user().profile.clanName,
      enemyName: enemy,
      size: size,
      createdAt: new Date(),
      targets: targets
    }, function(error, _id) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      Router.go('war', {_id: _id});
    });
    
    /*Wars.insert({
      name: "vs. " + enemy,
      myClanName: "444 Streampunks",
      enemyName: enemy,
      size: size,
      createdAt: new Date(),
      owner: "444 Streampunks"
    }, function(error, _id) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      Router.go('war', {_id: _id});
    });*/
  },
  'change input.optin': function (event) {
     Meteor.call("setOptin", this._id, event.target.checked);
  }
});
