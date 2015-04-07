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
  }
});

Template.warDeclare.events({
  'submit': function(event, template) {
    event.preventDefault();
    var enemy = template.$('[name=enemy]').val();
    var size = template.$('[name=size]').val();
    var errors = {};
    
    if (! Meteor.user()) {
      errors.login = 'You must be logged in';
    }

    if (! enemy) {
      errors.enemy = 'Enemy name required';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Wars.insert({
      name: "vs. " + enemy,
      friendlyID: Meteor.user().profile.clanID,
      friendlyName: Meteor.user().profile.clanName,
      enemyName: enemy,
      size: size,
      createdAt: new Date()
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
  }
});
