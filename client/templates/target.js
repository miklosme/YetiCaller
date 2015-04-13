Template.target.events({
  'click .register': function(event, template) {
    event.preventDefault();
    
    Meteor.call('registerAttack', Template.parentData(2)._id, this.index);
  }
});

Template.target.helpers({
  'star1': function() {
    return 'acquired';
  },
  'star2': function() {
  },
  'star3': function() {
    return '';
  }
});