var WAR_ID;

Template.target.onCreated(function () {
  WAR_ID = Template.parentData(2)._id;
});

Template.target.helpers({
  'star': function(n) {
    return (this.starCount >= n) ? 'acquired' : '';
  },
  'isReserved': function() {
    return !!this.bookedForName;
  },
  'anyAttacksLeft': function() {
    var myWarInfo = _.findWhere(Wars.findOne(WAR_ID).participants, {
      _id: Meteor.user()._id
    });
    if (!myWarInfo) {
      return false;
    }
    return myWarInfo.attacksLeft > 0;
  },
  'noPendingAttack': function() {
    if (!Meteor.user()) return;

    var userID = Meteor.user()._id;
    var anyPendingAttack = _.any(Wars.findOne(WAR_ID).targets, function(t) {
      return t.bookedForID === userID;
    });
    return !anyPendingAttack;
  },
  'anyAttacks': function() {
    return !!this.bestAttackerName;
  },
  'canHandleReservation': function() {
    var user = Meteor.user();
    if (!user)
      return false;

    if (user._id === this.bookedForID) {
      return true;
    }

    var rank = user.profile.rank || RANK_MEMBER;
    return (rank === RANK_LEADER) || (rank === RANK_COLEADER);
  },
  'notAttackedThisYet': function() {
    var userID = Meteor.user()._id;
    var alreadyTried = _.any(this.attacks, function(t) {
      return t.id === userID;
    });
    return !alreadyTried;
  }
});

Template.target.events({
  'click .register': function(event, template) {
    event.preventDefault();

    Meteor.call('registerAttack', WAR_ID, this.index);
  },
  'click .register-container .delete': function(event, template) {
    event.preventDefault();

    Meteor.call('deleteAttack', WAR_ID, this.index);
  },
  'click .register-container .set-result.star0': function(event, template) {
    event.preventDefault();

    Meteor.call('setResult', WAR_ID, this.index, 0);
  },
  'click .register-container .set-result.star1': function(event, template) {
    event.preventDefault();

    Meteor.call('setResult', WAR_ID, this.index, 1);
  },
  'click .register-container .set-result.star2': function(event, template) {
    event.preventDefault();

    Meteor.call('setResult', WAR_ID, this.index, 2);
  },
  'click .register-container .set-result.star3': function(event, template) {
    event.preventDefault();

    Meteor.call('setResult', WAR_ID, this.index, 3);
  }
});
