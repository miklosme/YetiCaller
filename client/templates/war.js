var STRATEGY_EDIT_KEY = 'warStrategyEdit';

Template.war.events({
  'click .delete-war': function() {
    var confirmed = window.confirm('Do you really want to delete this war?');
    if (confirmed) {
      Wars.remove(this._id);
      Router.go('home');
    }
  },
  'focus textarea.war-strategy': function(event) {
    if (!isLeader())
      return;

    Session.set(STRATEGY_EDIT_KEY, true);
  },
  'blur textarea.war-strategy': function(event) {
    Session.set(STRATEGY_EDIT_KEY, false);
  },
  'keyup textarea': _.throttle(function(event) {
    Wars.update(this._id, {$set: {warStrategy: event.target.value}});
  }, 300),
  'click .elevator-button': function(e, template) {
    e.preventDefault();
    template.$('.content-scrollable').scrollTop(0);
  }
});

Template.war.helpers({
  'editingStrategy': function() {
    return Session.get(STRATEGY_EDIT_KEY) && 'editing';
  },
  'strategyShouldDisplayed': function() {
    if (this.warStrategy) {
      return true;
    }

    return isLeader();
  },
  'attacksLeft': function() {
    var sum = 0;
    _.each(this.participants, function(t) {
      sum += t.attacksLeft;
    });
    return sum;
  },
  'starsAcquired': function() {
    var sum = 0;
    _.each(this.targets, function(t) {
      sum += t.starCount;
    });
    return sum;
  }
});

Template.war.onRendered(function () {
  /*var elevator = new Elevator({
    element: document.querySelector('.elevator-button'),
    mainAudio: '/audio/ding.mp3',
    endAudio: '/audio/elevator-music.mp3'
  });*/
});
