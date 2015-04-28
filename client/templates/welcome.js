var stats = {};

Template.welcome.onRendered(function () {
  Session.set('statsReady', false);

  Meteor.call('getWelcomePageStats', function(error, result) {
    stats = result;
    Session.set('statsReady', true);
  })
});

Template.welcome.helpers({
  'statsReady': function() {
    return Session.get('statsReady');
  },
  'stats': function() {
    return stats;
  }
  /*clanCount: function() {
    return 0;
  },
  playerCount: function() {
    return 0;
  },
  warCount: function() {
    return 0;
  },
  chatMessageCount: function() {
    return 0;
  }*/
});
