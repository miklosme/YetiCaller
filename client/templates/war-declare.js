var ERRORS_KEY = 'warDeclareErrors';
/*Template.warDeclare.onRendered(function() {
  makeMembersSortable();
});*/

Template.warDeclare.onRendered(function() {
  var user = Meteor.user();
  if (user && user.profile.rank >= RANK_ELDER) {
    var members = this.$('table#members tbody')[0];
    var that = this;
    dragula([members], {
      moves: function (el, container, handle) {
        return handle.className === 'name';
      }
    }).on('drop', function (el) {
      var order = {};
      that.$('table#members tbody tr').each(function(index) {
        order[$(this).data('id')] = index;
      });
      var clanID = user.profile.clanID;
      Meteor.call('reorderClan', clanID, order);
    });
  }
});

Template.warDeclare.onCreated(function() {
  Session.set(ERRORS_KEY, {});
  Session.set('needauto', false);
  Session.set('autoReserveShiftValue', 0);
});

Template.warDeclare.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  members: function() {
    var user = Meteor.user();
    if (user) {
      var clanID = user.profile.clanID;
      var order = Clans.findOne(clanID).order || {};
      var unsorted = Meteor.users.find({"profile.clanID": clanID}).fetch();
      var sorted = _.sortBy(unsorted, function(m) {
        return order[m._id] || 1;
      });
      return sorted;
    }
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
  },
  autoSettingsClass: function() {
    return Session.get('needauto') ? '' : 'hidden';
  },
  autoValueDisplay: function() {
    var val = Session.get('autoReserveShiftValue');
    var sign = (val < 0) ? '-' : '+';
    var num = Math.abs(val);
    return 'n -> n ' + sign + ' ' + num;
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
        attacks: [],
        starCount: 0,
        bestAttackerName: ''
        //bookedForName
        //bookedForID
      });
    }

    var clanID = Meteor.user().profile.clanID;
    var participantsCursor = Meteor.users.find({
      "profile.clanID": clanID,
      "profile.optin": true
    });

    var clanOrder = Clans.findOne(clanID).order;

    var participants = _.map(participantsCursor.fetch(), function(player) {
      return {
        _id: player._id,
        name: player.profile.name,
        attacksLeft: 2,
        position: clanOrder[player._id]
      }
    });

    Wars.insert({
      name: "vs. " + enemy,
      friendlyID: clanID,
      friendlyName: Meteor.user().profile.clanName,
      enemyName: enemy,
      size: size,
      createdAt: new Date(),
      targets: targets,
      participants: participants,
      warStrategyHeight: 100
    }, function(error, _id) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      if (Session.get('needauto')) {
        Meteor.call('autoReserve', _id, Session.get('autoReserveShiftValue'));
      }

      Router.go('war', {_id: _id});
    });
  },
  'change input.optin': function (event) {
    Meteor.call("setOptin", this._id, event.target.checked);
  },
  'change input#needauto': function (event) {
    Session.set('needauto', !!event.target.checked);
  },
  'change input#autovalue': function(event) {
    Session.set('autoReserveShiftValue', +event.target.value);
  }
});
